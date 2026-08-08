import { ESTADOS, type Estado, type Lote } from "./types";

export type TipoSummary = {
  tipoPan: string;
  unidades: number;
  lotes: number;
};

export type EstadoSummary = {
  estado: Estado;
  unidades: number;
  lotes: number;
  share: number;
};

export function totalUnidades(lotes: Lote[]): number {
  return lotes.reduce((sum, l) => sum + l.unidades, 0);
}

export function unidadesPorTipo(lotes: Lote[]): TipoSummary[] {
  const byTipo = new Map<string, TipoSummary>();

  for (const lote of lotes) {
    const entry = byTipo.get(lote.tipoPan) ?? {
      tipoPan: lote.tipoPan,
      unidades: 0,
      lotes: 0,
    };
    entry.unidades += lote.unidades;
    entry.lotes += 1;
    byTipo.set(lote.tipoPan, entry);
  }

  return [...byTipo.values()].sort((a, b) => b.unidades - a.unidades);
}

export function unidadesPorEstado(lotes: Lote[]): EstadoSummary[] {
  const total = totalUnidades(lotes);

  return ESTADOS.map((estado) => {
    const delEstado = lotes.filter((l) => l.estado === estado);
    const unidades = totalUnidades(delEstado);
    return {
      estado,
      unidades,
      lotes: delEstado.length,
      share: total === 0 ? 0 : unidades / total,
    };
  });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function formatPercent(share: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(share);
}
