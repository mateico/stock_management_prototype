import {
  formatNumber,
  formatPercent,
  type EstadoSummary,
} from "@/lib/summary";
import { ESTADO_COLOR } from "./EstadoBadge";

/**
 * Part-to-whole across three states. Segments are separated by a 2px gap in
 * the surface color rather than a border, and every value is spelled out in
 * the legend below (the warning step is sub-3:1 on the light surface, so it
 * never carries meaning on its own).
 */
export function EstadoBreakdown({ data }: { data: EstadoSummary[] }) {
  const visible = data.filter((d) => d.unidades > 0);

  return (
    <section className="rounded-xl border border-hairline bg-surface p-5">
      <h2 className="text-sm font-semibold">Unidades por estado</h2>
      <p className="mt-1 text-sm text-ink-secondary">
        Avance de la producción sobre el total de unidades.
      </p>

      <div className="mt-5 flex h-3.5 w-full gap-[2px] overflow-hidden rounded-[4px]">
        {visible.map((d) => (
          <span
            key={d.estado}
            title={`${d.estado}: ${formatNumber(d.unidades)} unidades`}
            className="h-full first:rounded-l-[4px] last:rounded-r-[4px]"
            style={{
              width: `${d.share * 100}%`,
              backgroundColor: ESTADO_COLOR[d.estado],
            }}
          />
        ))}
      </div>

      <dl className="mt-5 flex flex-col gap-3">
        {data.map((d) => (
          <div key={d.estado} className="flex items-baseline gap-2.5">
            <span
              aria-hidden
              className="size-2.5 shrink-0 translate-y-px rounded-full"
              style={{ backgroundColor: ESTADO_COLOR[d.estado] }}
            />
            <dt className="text-sm text-ink-secondary">{d.estado}</dt>
            <span
              aria-hidden
              className="min-w-4 flex-1 self-center border-b border-dotted border-grid"
            />
            <dd className="text-sm tabular-nums">
              <span className="font-medium">{formatNumber(d.unidades)}</span>
              <span className="text-ink-muted">
                {" "}
                u · {formatPercent(d.share)} · {d.lotes}{" "}
                {d.lotes === 1 ? "lote" : "lotes"}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
