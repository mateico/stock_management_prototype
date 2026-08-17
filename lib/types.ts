export const EMPAQUES = ["Produccion", "En Proceso", "Listo", "Fin"] as const;
export type Empaque = (typeof EMPAQUES)[number];
export function isEmpaque(value: string): value is Empaque {
  return (EMPAQUES as readonly string[]).includes(value);
}

export const CHOFERES = ["n/d", "Juan", "Mario"] as const;
export type Chofer = (typeof CHOFERES)[number];
export function isChofer(value: string): value is Chofer {
  return (CHOFERES as readonly string[]).includes(value);
}

export const DISTRIBUCIONES = ["En planta", "Cargado", "Entregado"] as const;
export type Distribucion = (typeof DISTRIBUCIONES)[number];
export function isDistribucion(value: string): value is Distribucion {
  return (DISTRIBUCIONES as readonly string[]).includes(value);
}

/**
 * One PAN row within a client's block.
 * Sheet columns: PAN | CANT. | PQT | NOTA 2 | Empaque
 */
export type PanItem = {
  /** Stable key for React. Not a sheet column. */
  id: string;
  /** 1-indexed row in the sheet, used to target writes at this exact row. */
  rowNumber: number;
  pan: string;
  cant: number;
  pqt: number;
  nota2: string;
  /** Raw trimmed value — may not match a known Empaque, render as-is. */
  empaque: string;
};

/**
 * One client block in the daily pedidos sheet.
 * Sheet columns: nota 1 | CLIENTE | ... | Chofer | Distribucion
 * (chofer/distribucion/nota1/cliente are only written on the block's first
 * row; every following row until a blank separator is a PanItem for it.)
 */
export type Cliente = {
  /** Stable key for React. Not a sheet column. */
  id: string;
  /** 1-indexed row in the sheet where this client's header cells live. */
  rowNumber: number;
  nota1: string;
  cliente: string;
  chofer: string;
  distribucion: string;
  panes: PanItem[];
};
