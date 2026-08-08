import { formatNumber } from "@/lib/summary";
import type { Lote } from "@/lib/types";
import { EstadoBadge } from "./EstadoBadge";

type LotesTableProps = {
  lotes: Lote[];
  onEdit: (lote: Lote) => void;
};

export function LotesTable({ lotes, onEdit }: LotesTableProps) {
  return (
    <section className="rounded-xl border border-hairline bg-surface">
      <div className="flex items-baseline justify-between gap-4 p-5">
        <h2 className="text-sm font-semibold">Detalle de lotes</h2>
        <p className="text-sm text-ink-muted tabular-nums">
          {lotes.length} {lotes.length === 1 ? "registro" : "registros"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="border-y border-hairline text-left text-ink-muted">
              <th scope="col" className="px-5 py-2.5 font-medium">
                Tipo de pan
              </th>
              <th scope="col" className="px-5 py-2.5 font-medium">
                Lote
              </th>
              <th scope="col" className="px-5 py-2.5 text-right font-medium">
                Unidades
              </th>
              <th scope="col" className="px-5 py-2.5 font-medium">
                Estado
              </th>
              <th scope="col" className="px-5 py-2.5 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lotes.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-ink-muted"
                >
                  Todavía no hay lotes cargados.
                </td>
              </tr>
            ) : (
              lotes.map((lote) => (
                <tr
                  key={lote.id}
                  className="border-b border-hairline last:border-b-0"
                >
                  <td className="px-5 py-3">{lote.tipoPan}</td>
                  <td className="px-5 py-3 font-mono text-ink-secondary">
                    {lote.lote}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {formatNumber(lote.unidades)}
                  </td>
                  <td className="px-5 py-3">
                    <EstadoBadge estado={lote.estado} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(lote)}
                      className="rounded-lg border border-hairline px-3 py-1.5 text-sm font-medium transition-colors hover:bg-plane focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                    >
                      Editar
                      <span className="sr-only"> lote {lote.lote}</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
