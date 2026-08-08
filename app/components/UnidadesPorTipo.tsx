import { formatNumber, type TipoSummary } from "@/lib/summary";

/**
 * Magnitude across nominal categories: one series, one hue for every bar.
 * Values are direct-labelled at the tip, so the chart needs no gridlines and
 * no legend.
 */
export function UnidadesPorTipo({ data }: { data: TipoSummary[] }) {
  const max = Math.max(...data.map((d) => d.unidades), 1);

  return (
    <section className="rounded-xl border border-hairline bg-surface p-5">
      <h2 className="text-sm font-semibold">Unidades por tipo de pan</h2>
      <p className="mt-1 text-sm text-ink-secondary">
        Total producido y planificado, todos los estados.
      </p>

      <ul className="mt-5 flex flex-col gap-3.5">
        {data.map((d) => (
          <li
            key={d.tipoPan}
            tabIndex={0}
            className="group relative grid grid-cols-[minmax(6.5rem,9rem)_1fr_auto] items-center gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="truncate text-sm text-ink-secondary">
              {d.tipoPan}
            </span>

            <span className="flex h-3.5 items-center">
              <span
                className="h-3.5 rounded-r-[4px] bg-accent"
                style={{ width: `${(d.unidades / max) * 100}%` }}
              />
            </span>

            <span className="text-sm font-medium tabular-nums">
              {formatNumber(d.unidades)}
            </span>

            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-24 z-10 mb-1 hidden rounded-lg border border-hairline bg-surface px-3 py-2 text-xs whitespace-nowrap shadow-lg group-hover:block group-focus-visible:block"
            >
              <span className="font-medium">{d.tipoPan}</span>
              <span className="mt-0.5 block text-ink-secondary">
                {formatNumber(d.unidades)} unidades · {d.lotes}{" "}
                {d.lotes === 1 ? "lote" : "lotes"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
