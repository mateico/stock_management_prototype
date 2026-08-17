import { NextResponse } from "next/server";
import { getPedidos } from "@/lib/pedidos";

export async function GET() {
  try {
    const pedidos = await getPedidos();
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error fetching pedidos:", error);
    return NextResponse.json(
      { error: "Failed to fetch pedidos" },
      { status: 500 },
    );
  }
}
