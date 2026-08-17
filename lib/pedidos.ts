import type { Cliente } from "./types";
import { getSheetData } from "./sheets";

/**
 * Folds the flat sheet rows into client blocks. Sheet columns:
 * nota 1 | CLIENTE | PAN | CANT. | PQT | NOTA 2 | Empaque | Chofer | Distribucion
 *
 * A client's nota1/cliente/chofer/distribucion are only written on the first
 * row of its block; every following row (until a blank separator row) is a
 * pan item for that same client. `rows` excludes the header row; row 0 here
 * is sheet row 2.
 */
export function parsePedidos(rows: string[][]): Cliente[] {
  const clientes: Cliente[] = [];
  let current: Cliente | null = null;

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +1 for header, +1 for 1-indexing
    const [nota1, cliente, pan, cant, pqt, nota2, empaque, chofer, distribucion] = Array.from(
      { length: 9 },
      (_, i) => (row[i] ?? "").trim(),
    );

    const isBlank = [nota1, cliente, pan, cant, pqt, nota2, empaque, chofer, distribucion].every(
      (cell) => cell === "",
    );
    if (isBlank) {
      current = null;
      return;
    }

    if (cliente) {
      current = {
        id: `cliente-${clientes.length}`,
        rowNumber,
        nota1,
        cliente,
        chofer,
        distribucion,
        panes: [],
      };
      clientes.push(current);
    }

    if (pan) {
      if (!current) {
        console.warn(`pedidos: pan row at sheet row ${rowNumber} has no client, skipping`);
        return;
      }
      current.panes.push({
        id: `${current.id}-${current.panes.length}`,
        rowNumber,
        pan,
        cant: parseInt(cant, 10) || 0,
        pqt: parseInt(pqt, 10) || 0,
        nota2,
        empaque,
      });
    }
  });

  return clientes;
}

export async function getPedidos(): Promise<Cliente[]> {
  const rows = await getSheetData();
  if (rows.length < 2) return [];
  return parsePedidos(rows.slice(1));
}
