import { Dashboard } from "./components/Dashboard";
import { getLotes } from "@/lib/data";

export default async function Page() {
  const lotes = await getLotes();

  return <Dashboard initialLotes={lotes} />;
}
