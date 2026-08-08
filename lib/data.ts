import type { Lote } from "./types";
import { isEstado } from "./types";
import { getSheetData } from "./sheets";

export async function getLotes(): Promise<Lote[]> {
  const rows = await getSheetData();

  if (rows.length < 2) return [];

  return rows.slice(1).map((row, index) => ({
    id: `row-${index}`,
    tipoPan: row[0] || "",
    lote: row[1] || "",
    unidades: parseInt(row[2] || "0", 10),
    estado: isEstado(row[3]) ? row[3] : "Programado",
  }));
}
