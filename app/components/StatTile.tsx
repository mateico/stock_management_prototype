import type { ReactNode } from "react";

type StatTileProps = {
  label: string;
  value: string;
  /** Optional context line under the value. */
  note?: ReactNode;
  /** The one number the dashboard leads with. Exactly one per view. */
  hero?: boolean;
};

export function StatTile({ label, value, note, hero = false }: StatTileProps) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <p className="text-sm text-ink-secondary">{label}</p>
      <p
        className={
          hero
            ? "mt-2 text-5xl leading-none font-semibold tracking-tight"
            : "mt-2 text-3xl leading-none font-semibold tracking-tight"
        }
      >
        {value}
      </p>
      {note ? (
        <p className="mt-2 text-sm text-ink-muted">{note}</p>
      ) : null}
    </div>
  );
}
