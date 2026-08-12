"use client";

import { useMemo, useState } from "react";
import {
  formatNumber,
  formatPercent,
  totalUnidades,
  unidadesPorEstado,
  unidadesPorTipo,
} from "@/lib/summary";
import type { Lote } from "@/lib/types";
import { EstadoBreakdown } from "./EstadoBreakdown";
import { LoteFormDialog } from "./LoteFormDialog";
import { LotesTable } from "./LotesTable";
import { StatTile } from "./StatTile";
import { UnidadesPorTipo } from "./UnidadesPorTipo";

type FormState = { mode: "add" } | { mode: "edit"; lote: Lote };

export function Dashboard({ initialLotes }: { initialLotes: Lote[] }) {
  const [lotes, setLotes] = useState(initialLotes);
  const [form, setForm] = useState<FormState | null>(null);

  const total = useMemo(() => totalUnidades(lotes), [lotes]);
  const porTipo = useMemo(() => unidadesPorTipo(lotes), [lotes]);
  const porEstado = useMemo(() => unidadesPorEstado(lotes), [lotes]);

  const completado = porEstado.find((e) => e.estado === "Completado");
  const enProgreso = porEstado.find((e) => e.estado === "En Progreso");

  async function handleSave(values: Omit<Lote, "id">) {
    try {
      if (form?.mode === "edit") {
        // Find the row index
        const rowIndex = lotes.findIndex((l) => l.id === form.lote.id);
        if (rowIndex === -1) return;

        await fetch("/api/lotes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rowIndex, lote: values }),
        });

        setLotes((current) =>
          current.map((l) =>
            l.id === form.lote.id ? { ...values, id: l.id } : l,
          ),
        );
      } else {
        await fetch("/api/lotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        setLotes((current) => [
          ...current,
          { ...values, id: `row-${current.length}` },
        ]);
      }
      setForm(null);
    } catch (error) {
      console.error("Error saving lote:", error);
    }
  }

  async function refreshData() {
    try {
      const response = await fetch("/api/lotes");
      const updatedLotes = await response.json();
      setLotes(updatedLotes);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Producción de panadería 2
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Resumen de lotes registrados en la planilla de producción.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ mode: "add" })}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-plane focus-visible:outline-none"
        >
          Agregar lote
        </button>
        <button
          type="button"
          onClick={refreshData}
          className="rounded-lg border border-ink-tertiary px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-plane-hover"
        >
          Actualizar
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          hero
          label="Unidades totales"
          value={formatNumber(total)}
          note={`${lotes.length} ${lotes.length === 1 ? "lote" : "lotes"} registrados`}
        />
        <StatTile
          label="Completadas"
          value={formatNumber(completado?.unidades ?? 0)}
          note={`${formatPercent(completado?.share ?? 0)} del total`}
        />
        <StatTile
          label="En progreso"
          value={formatNumber(enProgreso?.unidades ?? 0)}
          note={`${enProgreso?.lotes ?? 0} ${
            enProgreso?.lotes === 1 ? "lote activo" : "lotes activos"
          }`}
        />
        <StatTile
          label="Tipos de pan"
          value={formatNumber(porTipo.length)}
          note={porTipo[0] ? `Mayor volumen: ${porTipo[0].tipoPan}` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UnidadesPorTipo data={porTipo} />
        <EstadoBreakdown data={porEstado} />
      </div>

      <LotesTable
        lotes={lotes}
        onEdit={(lote) => setForm({ mode: "edit", lote })}
      />

      {form ? (
        <LoteFormDialog
          key={form.mode === "edit" ? form.lote.id : "nuevo"}
          lote={form.mode === "edit" ? form.lote : null}
          lotes={lotes}
          onSave={handleSave}
          onClose={() => setForm(null)}
        />
      ) : null}
    </main>
  );
}
