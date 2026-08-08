export const ESTADOS = ["Completado", "En Progreso", "Programado"] as const;

export type Estado = (typeof ESTADOS)[number];

/**
 * One row of the production sheet.
 * Sheet columns: Tipo_pan | Lote | Unidades | Estado
 */
export type Lote = {
  /** Stable key for React / edits. Not a sheet column. */
  id: string;
  tipoPan: string;
  lote: string;
  unidades: number;
  estado: Estado;
};

export function isEstado(value: string): value is Estado {
  return (ESTADOS as readonly string[]).includes(value);
}
