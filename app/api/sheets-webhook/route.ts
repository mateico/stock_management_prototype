import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: NextRequest) {
  const expected = process.env.SHEETS_WEBHOOK_SECRET?.trim();
  const provided = request.headers.get("x-webhook-secret");

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const stub = env.SHEET_UPDATES.getByName("global");
  await stub.broadcastUpdate();

  return NextResponse.json({ success: true });
}
