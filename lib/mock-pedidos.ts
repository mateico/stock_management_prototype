import { CHOFERES, DISTRIBUCIONES, EMPAQUES, type Cliente, type PanItem } from "./types";

const BARRIOS = [
  "Brazo Oriental",
  "Carrasco Norte",
  "Aguada",
  "La Blanqueada",
  "Sayago",
  "Malvin Norte",
  "Pocitos",
  "Cordon",
  "Tres Cruces",
  "Buceo",
  "Punta Gorda",
  "Parque Rodo",
  "Centro",
  "Union",
  "Belvedere",
];

const PANES = [
  "HOAGIE QUESO RET",
  "BROT BRILLO RET",
  "BUNS QUESO RET",
  "BUNS CLASICO RET",
  "HOAGIE CLASICO RET",
  "BUNS SEMILLA RET",
  "BROT QUESO RET",
];

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function generateMockPedidos(count: number): Cliente[] {
  let rowNumber = 2;

  return Array.from({ length: count }, (_, clienteIndex) => {
    const clienteRowNumber = rowNumber;
    const panCount = randomInt(1, 6);

    const panes: PanItem[] = Array.from({ length: panCount }, (_, panIndex) => {
      const panRowNumber = rowNumber;
      rowNumber += 1;
      return {
        id: `mock-cliente-${clienteIndex}-${panIndex}`,
        rowNumber: panRowNumber,
        pan: pick(PANES),
        cant: randomInt(4, 60),
        pqt: randomInt(1, 10),
        nota2: Math.random() < 0.1 ? "#ses. bco." : "",
        empaque: pick(EMPAQUES),
      };
    });

    rowNumber += 1; // blank separator row

    return {
      id: `mock-cliente-${clienteIndex}`,
      rowNumber: clienteRowNumber,
      nota1: "retail",
      cliente: `PEDIDOS YA ${pick(BARRIOS)} ${clienteIndex + 1}`,
      chofer: pick(CHOFERES),
      distribucion: pick(DISTRIBUCIONES),
      panes,
    };
  });
}
