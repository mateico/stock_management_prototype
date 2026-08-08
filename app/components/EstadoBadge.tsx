import type { Estado } from "@/lib/types";

/**
 * Status is never carried by color alone: every badge ships an icon and its
 * label, and the text stays in ink tokens rather than the status hue.
 */
export const ESTADO_COLOR: Record<Estado, string> = {
  Completado: "var(--good)",
  "En Progreso": "var(--warning)",
  Programado: "var(--neutral)",
};

function EstadoIcon({ estado }: { estado: Estado }) {
  const common = {
    width: 12,
    height: 12,
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: ESTADO_COLOR[estado],
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (estado === "Completado") {
    return (
      <svg {...common}>
        <path d="M2 6.4 4.7 9 10 3.2" />
      </svg>
    );
  }

  if (estado === "En Progreso") {
    return (
      <svg {...common}>
        <circle cx="6" cy="6" r="4.4" />
        <path d="M6 3.4V6l1.8 1.1" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="1.6" y="2.4" width="8.8" height="8" rx="1.4" />
      <path d="M1.6 5h8.8M4 1.4v2M8 1.4v2" />
    </svg>
  );
}

export function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2.5 py-1 text-xs font-medium whitespace-nowrap text-ink-secondary">
      <EstadoIcon estado={estado} />
      {estado}
    </span>
  );
}
