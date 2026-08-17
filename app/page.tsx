import { Dashboard } from "./components/Dashboard";
import { getPedidos } from "@/lib/pedidos";

export const revalidate = 0; // dDisable static prerendering

export default async function Page() {
  const pedidos = await getPedidos();

  return <Dashboard initialPedidos={pedidos} />;
}
