import { PreviewDashboard } from "../components/PreviewDashboard";
import { generateMockPedidos } from "@/lib/mock-pedidos";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ count?: string }>;
}) {
  const { count } = await searchParams;
  const parsed = parseInt(count ?? "30", 10);
  const total = Number.isFinite(parsed)
    ? Math.max(0, Math.min(parsed, 2000))
    : 50;

  return <PreviewDashboard initialPedidos={generateMockPedidos(total)} />;
}
