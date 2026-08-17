import type { PedidoView } from "./PedidoList";

const OPTIONS: { value: PedidoView; label: string }[] = [
  { value: "stacked", label: "Lista" },
  { value: "grid", label: "Grilla" },
];

export function ViewSwitcher({
  view,
  onChange,
}: {
  view: PedidoView;
  onChange: (view: PedidoView) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Vista de pedidos"
      className="inline-flex rounded-lg border border-hairline bg-surface p-0.5"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            view === option.value
              ? "bg-accent text-accent-ink"
              : "text-ink-secondary hover:bg-plane"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
