import type { Cliente } from "@/lib/types";
import { PedidoCard, type ClientePatch, type PanItemPatch } from "./PedidoCard";
import { PedidoGrid } from "./PedidoGrid";

export type PedidoView = "stacked" | "grid";

export function PedidoList({
  clientes,
  view,
  onUpdatePanItem,
  onUpdateCliente,
}: {
  clientes: Cliente[];
  view: PedidoView;
  onUpdatePanItem: (
    clienteId: string,
    panItemId: string,
    patch: PanItemPatch,
  ) => void;
  onUpdateCliente: (clienteId: string, patch: ClientePatch) => void;
}) {
  if (clientes.length === 0) {
    return (
      <p className="rounded-xl border border-hairline bg-surface p-10 text-center text-sm text-ink-muted">
        Todavía no hay pedidos cargados.
      </p>
    );
  }

  if (view === "grid") {
    return (
      <PedidoGrid
        clientes={clientes}
        onUpdatePanItem={onUpdatePanItem}
        onUpdateCliente={onUpdateCliente}
      />
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] gap-4">
      {clientes.map((cliente) => (
        <PedidoCard
          key={cliente.id}
          cliente={cliente}
          dense={true}
          onUpdatePanItem={onUpdatePanItem}
          onUpdateCliente={onUpdateCliente}
        />
      ))}
    </div>
  );
}
