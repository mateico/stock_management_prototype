import type { Cliente } from "@/lib/types";
import { PedidoCard, type ClientePatch, type PanItemPatch } from "./PedidoCard";

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
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(max(14rem, calc((100% - 9 * 0.75rem) / 10)), 1fr))",
        }}
      >
        {/* Dense multi-column layout for large screens. True zero-scroll can't
            be guaranteed for an unbounded number of pedidos/panes — the goal
            is maximum density for realistic order volumes; use /preview to
            tune this for the volumes that actually show up.

            The max() sets the column floor to whichever is larger: 14rem, or a
            tenth of the row (minus the 9 gaps of 0.75rem between 10 columns).
            So narrow screens get as many 14rem columns as fit, and very wide
            ones widen the columns instead of going past 10. */}
        {clientes.map((cliente) => (
          <PedidoCard
            key={cliente.id}
            cliente={cliente}
            dense
            onUpdatePanItem={onUpdatePanItem}
            onUpdateCliente={onUpdateCliente}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {clientes.map((cliente) => (
        <PedidoCard
          key={cliente.id}
          cliente={cliente}
          onUpdatePanItem={onUpdatePanItem}
          onUpdateCliente={onUpdateCliente}
        />
      ))}
    </div>
  );
}
