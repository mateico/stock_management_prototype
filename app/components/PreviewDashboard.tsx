"use client";

import { useEffect, useRef, useState } from "react";

import type { Cliente } from "@/lib/types";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { PedidoList, type PedidoView } from "./PedidoList";
import { ViewSwitcher } from "./ViewSwitcher";

/**
 * Same shell as Dashboard, but edits only update local state — no fetch, no
 * websocket. Lets you load /preview?count=300 to tune the dense grid layout
 * without touching the real sheet or needing that much real data.
 */
export function PreviewDashboard({ initialPedidos }: { initialPedidos: Cliente[] }) {
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

  function handleUpdatePanItem(
    clienteId: string,
    panItemId: string,
    patch: { cant?: number; pqt?: number; empaque?: string },
  ) {
    setPedidos((current) =>
      current.map((c) =>
        c.id === clienteId
          ? { ...c, panes: c.panes.map((p) => (p.id === panItemId ? { ...p, ...patch } : p)) }
          : c,
      ),
    );
  }

  function handleUpdateCliente(
    clienteId: string,
    patch: { chofer?: string; distribucion?: string },
  ) {
    setPedidos((current) =>
      current.map((c) => (c.id === clienteId ? { ...c, ...patch } : c)),
    );
  }

  return (
    <main
      className={`mx-auto flex w-full flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10 ${
        view === "grid" ? "max-w-none" : "max-w-6xl"
      }`}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Preview — {pedidos.length} pedidos (datos de prueba)
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Ediciones sólo locales, no se escriben en la planilla.
          </p>
        </div>
        <ViewSwitcher view={view} onChange={handleViewChange} />
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
