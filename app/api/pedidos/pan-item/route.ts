import { NextRequest, NextResponse } from "next/server";
import { updatePanItem } from "@/lib/sheets";

export async function PATCH(request: NextRequest) {
  try {
    const { rowNumber, cant, pqt, nota2, empaque } = (await request.json()) as {
      rowNumber: number;
      cant: number;
      pqt: number;
      nota2: string;
      empaque: string;
    };
    await updatePanItem(rowNumber, { cant, pqt, nota2, empaque });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating pan item:", error);
    return NextResponse.json(
      { error: "Failed to update pan item" },
      { status: 500 },
    );
  }
}
