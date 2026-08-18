"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Cliente } from "@/lib/types";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { PedidoList, type PedidoView } from "./PedidoList";
import type { ClientePatch, PanItemPatch } from "./PedidoCard";
import { ViewSwitcher } from "./ViewSwitcher";

export function Dashboard({ initialPedidos }: { initialPedidos: Cliente[] }) {
  const [pedidos, setPedidos] = useState(initialPedidos);
  const isDesktop = useIsDesktop();
  const [view, setView] = useState<PedidoView>("stacked");
  const hasManualView = useRef(false);

  useEffect(() => {
    if (!hasManualView.current) setView(isDesktop ? "grid" : "stacked");
  }, [isDesktop]);

  function handleViewChange(next: PedidoView) {
    hasManualView.current = true;
    setView(next);
  }

  const refreshData = useCallback(async () => {
    try {
      const response = await fetch("/api/pedidos");
      const updated = (await response.json()) as Cliente[];
      setPedidos(updated);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }, []);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      socket = new WebSocket(
        `${protocol}//${window.location.host}/api/sheets-stream`,
      );

      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "updated") refreshData();
        } catch {
          // ignore malformed messages
        }
      });

      socket.addEventListener("close", () => {
        if (!cancelled) reconnectTimer = setTimeout(connect, 3000);
      });

      socket.addEventListener("error", () => {
        socket?.close();
      });
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [refreshData]);

  const handleUpdatePanItem = useCallback(
    (clienteId: string, panItemId: string, patch: PanItemPatch) => {
      const cliente = pedidos.find((c) => c.id === clienteId);
      const item = cliente?.panes.find((p) => p.id === panItemId);
      if (!cliente || !item) return;

      const previous = {
        cant: item.cant,
        pqt: item.pqt,
        empaque: item.empaque,
      };
      const next = { ...previous, ...patch };

      setPedidos((current) =>
        current.map((c) =>
          c.id === clienteId
            ? {
                ...c,
                panes: c.panes.map((p) =>
                  p.id === panItemId ? { ...p, ...patch } : p,
                ),
              }
            : c,
        ),
      );

      fetch("/api/pedidos/pan-item", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rowNumber: item.rowNumber,
          cant: next.cant,
          pqt: next.pqt,
          nota2: item.nota2,
          empaque: next.empaque,
        }),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`Request failed: ${response.status}`);
        })
        .catch((error) => {
          console.error("Error updating pan item:", error);
          setPedidos((current) =>
            current.map((c) =>
              c.id === clienteId
                ? {
                    ...c,
                    panes: c.panes.map((p) =>
                      p.id === panItemId ? { ...p, ...previous } : p,
                    ),
                  }
                : c,
            ),
          );
        });
    },
    [pedidos],
  );

  const handleUpdateCliente = useCallback(
    (clienteId: string, patch: ClientePatch) => {
      const cliente = pedidos.find((c) => c.id === clienteId);
      if (!cliente) return;

      const previous = {
        chofer: cliente.chofer,
        distribucion: cliente.distribucion,
      };
      const next = { ...previous, ...patch };

      setPedidos((current) =>
        current.map((c) => (c.id === clienteId ? { ...c, ...patch } : c)),
      );

      fetch("/api/pedidos/cliente", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowNumber: cliente.rowNumber, ...next }),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`Request failed: ${response.status}`);
        })
        .catch((error) => {
          console.error("Error updating cliente:", error);
          setPedidos((current) =>
            current.map((c) =>
              c.id === clienteId ? { ...c, ...previous } : c,
            ),
          );
        });
    },
    [pedidos],
  );

  return (
    <main
      className={`mx-auto flex w-full flex-col gap-2 px-5 py-8 sm:px-8 sm:py-5 ${
        view === "grid" ? "h-dvh max-w-none overflow-hidden" : "max-w-6xl"
      }`}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Martino</h1>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher view={view} onChange={handleViewChange} />
          <button
            type="button"
            onClick={refreshData}
            className="rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-plane"
          >
            Actualizar
          </button>
        </div>
      </header>

      <PedidoList
        clientes={pedidos}
        view={view}
        onUpdatePanItem={handleUpdatePanItem}
        onUpdateCliente={handleUpdateCliente}
      />
    </main>
  );
}
