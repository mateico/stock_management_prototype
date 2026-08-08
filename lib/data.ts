import type { Lote } from "./types";

/**
 * Dummy stand-in for the Google Sheet.
 *
 * When the sheet is wired up, replace the body of `getLotes()` with the API
 * call (it already returns a promise) and leave the rest of the app untouched.
 */
const LOTES: Lote[] = [
  { id: "1", tipoPan: "Pan Blanco", lote: "LOT-001", unidades: 120, estado: "Completado" },
  { id: "2", tipoPan: "Pan Integral", lote: "LOT-002", unidades: 85, estado: "Completado" },
  { id: "3", tipoPan: "Baguette", lote: "LOT-003", unidades: 75, estado: "Completado" },
  { id: "4", tipoPan: "Pan Dulce", lote: "LOT-004", unidades: 60, estado: "Completado" },
  { id: "5", tipoPan: "Pan de Cebolla", lote: "LOT-005", unidades: 50, estado: "Completado" },
  { id: "6", tipoPan: "Pan Blanco", lote: "LOT-006", unidades: 110, estado: "Completado" },
  { id: "7", tipoPan: "Pan Integral", lote: "LOT-007", unidades: 90, estado: "Completado" },
  { id: "8", tipoPan: "Baguette", lote: "LOT-008", unidades: 70, estado: "En Progreso" },
  { id: "9", tipoPan: "Pan Dulce", lote: "LOT-009", unidades: 65, estado: "En Progreso" },
  { id: "10", tipoPan: "Pan de Cebolla", lote: "LOT-010", unidades: 55, estado: "Programado" },
  { id: "11", tipoPan: "Pan Blanco", lote: "LOT-011", unidades: 115, estado: "Completado" },
  { id: "12", tipoPan: "Pan Integral", lote: "LOT-012", unidades: 88, estado: "Completado" },
  { id: "13", tipoPan: "Baguette", lote: "LOT-013", unidades: 72, estado: "Completado" },
  { id: "14", tipoPan: "Pan Dulce", lote: "LOT-014", unidades: 62, estado: "Completado" },
  { id: "15", tipoPan: "Pan de Cebolla", lote: "LOT-015", unidades: 52, estado: "En Progreso" },
  { id: "16", tipoPan: "Pan Blanco", lote: "LOT-016", unidades: 125, estado: "Completado" },
  { id: "17", tipoPan: "Pan Integral", lote: "LOT-017", unidades: 92, estado: "En Progreso" },
  { id: "18", tipoPan: "Baguette", lote: "LOT-018", unidades: 78, estado: "Completado" },
  { id: "19", tipoPan: "Pan Dulce", lote: "LOT-020", unidades: 68, estado: "Completado" },
];

export async function getLotes(): Promise<Lote[]> {
  return LOTES;
}
