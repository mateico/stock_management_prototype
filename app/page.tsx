import { Dashboard } from "./components/Dashboard";
import { getLotes } from "@/lib/data";

export const revalidate = 0; // dDisable static prerendering

export default async function Page() {
  const lotes = await getLotes();

  return <Dashboard initialLotes={lotes} />;
}
