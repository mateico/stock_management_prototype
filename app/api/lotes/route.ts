import { NextRequest, NextResponse } from "next/server";
import type { Lote } from "@/lib/types";
import {
  appendLoteToSheet,
  updateLoteInSheet,
  getSheetData,
} from "@/lib/sheets";
import { isEstado } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const lote: Omit<Lote, "id"> = await request.json();
    await appendLoteToSheet(lote);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding lote:", error);
    return NextResponse.json({ error: "Failed to add lote" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { rowIndex, lote } = await request.json();
    await updateLoteInSheet(rowIndex, lote);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating lote:", error);
    return NextResponse.json(
      { error: "Failed to update lote" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const rows = await getSheetData();

    if (rows.length < 2) return NextResponse.json([]);

    const lotes = rows.slice(1).map((row, index) => ({
      id: `row-${index}`,
      tipoPan: row[0] || "",
      lote: row[1] || "",
      unidades: parseInt(row[2] || "0", 10),
      estado: isEstado(row[3]) ? row[3] : "Programado",
    }));

    return NextResponse.json(lotes);
  } catch (error) {
    console.error("Error fetching lotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch lotes" },
      { status: 500 },
    );
  }
}
