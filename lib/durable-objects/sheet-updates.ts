import { DurableObject } from "cloudflare:workers";

// Holds one hibernatable WebSocket per open board tab and fans out a tiny
// "updated" ping to all of them whenever the Sheets webhook reports an edit.
// Hibernation means Cloudflare doesn't bill duration while connections sit idle.
export class SheetUpdates extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected websocket upgrade", { status: 426 });
    }

    const pair = new WebSocketPair();
    this.ctx.acceptWebSocket(pair[1]);
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async webSocketClose(
    ws: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean,
  ) {
    ws.close(code, reason);
  }

  broadcastUpdate() {
    const payload = JSON.stringify({ type: "updated", ts: Date.now() });
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(payload);
      } catch {
        // Connection already gone; hibernation cleans these up on its own.
      }
    }
  }
}
