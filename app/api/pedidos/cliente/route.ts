import { NextRequest, NextResponse } from "next/server";
import { updateClienteHeader } from "@/lib/sheets";

export async function PATCH(request: NextRequest) {
  try {
    const { rowNumber, chofer, distribucion } = (await request.json()) as {
      rowNumber: number;
      chofer: string;
      distribucion: string;
    };
    await updateClienteHeader(rowNumber, { chofer, distribucion });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cliente:", error);
    return NextResponse.json(
      { error: "Failed to update cliente" },
      { status: 500 },
    );
  }
}
