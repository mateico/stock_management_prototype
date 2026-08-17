"use client";

import { useState } from "react";
import { CHOFERES, DISTRIBUCIONES, EMPAQUES, type Cliente, type PanItem } from "@/lib/types";

function selectOptions(known: readonly string[], current: string): string[] {
  return known.includes(current) ? [...known] : [current, ...known];
}

function empaqueColor(value: string): string {
  if (value === "Fin" || value === "Listo") return "var(--good)";
  if (value === "Produccion" || value === "En Proceso") return "var(--warning)";
  return "var(--neutral)";
}

function distribucionColor(value: string): string {
  return value === "Entregado" ? "var(--good)" : "var(--neutral)";
}

function StatusSelect({
  label,
  value,
  options,
  dense,
  colorVar,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  dense: boolean;
  colorVar?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={colorVar ? { borderColor: colorVar, color: colorVar } : undefined}
      className={`rounded-full border bg-transparent font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
        dense ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      } ${colorVar ? "" : "border-hairline text-ink-secondary"}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option || "—"}
        </option>
      ))}
    </select>
  );
}

function PanItemRow({
  item,
  dense,
  onCommit,
}: {
  item: PanItem;
  dense: boolean;
  onCommit: (patch: { cant?: number; pqt?: number; empaque?: string }) => void;
}) {
  const [cant, setCant] = useState(String(item.cant));
  const [cantSource, setCantSource] = useState(item.cant);
  if (item.cant !== cantSource) {
    setCantSource(item.cant);
    setCant(String(item.cant));
  }

  const [pqt, setPqt] = useState(String(item.pqt));
  const [pqtSource, setPqtSource] = useState(item.pqt);
  if (item.pqt !== pqtSource) {
    setPqtSource(item.pqt);
    setPqt(String(item.pqt));
  }

  function commitCant() {
    const parsed = Math.max(0, parseInt(cant, 10) || 0);
    setCant(String(parsed));
    if (parsed !== item.cant) onCommit({ cant: parsed });
  }

  function commitPqt() {
    const parsed = Math.max(0, parseInt(pqt, 10) || 0);
    setPqt(String(parsed));
    if (parsed !== item.pqt) onCommit({ pqt: parsed });
  }

  return (
    <div
      className={`flex flex-col gap-1.5 rounded-lg border border-hairline ${
        dense ? "px-2 py-1" : "px-3 py-2"
      }`}
    >
      <div className="min-w-0">
        <p className={`truncate font-medium ${dense ? "text-xs" : "text-sm"}`}>{item.pan}</p>
        {item.nota2 ? (
          <p className={`truncate text-ink-muted ${dense ? "text-[10px]" : "text-xs"}`}>
            {item.nota2}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={cant}
          onChange={(event) => setCant(event.target.value)}
          onBlur={commitCant}
          aria-label={`Cantidad de ${item.pan}`}
          className={`min-w-0 flex-1 rounded-md border border-hairline bg-transparent text-right tabular-nums focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            dense ? "px-1 py-0.5 text-[11px]" : "px-2 py-1 text-sm"
          }`}
        />
        <input
          type="number"
          min={0}
          value={pqt}
          onChange={(event) => setPqt(event.target.value)}
          onBlur={commitPqt}
          aria-label={`Paquetes de ${item.pan}`}
          className={`min-w-0 flex-1 rounded-md border border-hairline bg-transparent text-right tabular-nums focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            dense ? "px-1 py-0.5 text-[11px]" : "px-2 py-1 text-sm"
          }`}
        />
        <StatusSelect
          label={`Empaque de ${item.pan}`}
          value={item.empaque}
          options={selectOptions(EMPAQUES, item.empaque)}
          dense={dense}
          colorVar={empaqueColor(item.empaque)}
          onChange={(empaque) => onCommit({ empaque })}
        />
      </div>
    </div>
  );
}

export type PanItemPatch = { cant?: number; pqt?: number; empaque?: string };
export type ClientePatch = { chofer?: string; distribucion?: string };

export function PedidoCard({
  cliente,
  dense = false,
  onUpdatePanItem,
  onUpdateCliente,
}: {
  cliente: Cliente;
  dense?: boolean;
  onUpdatePanItem: (clienteId: string, panItemId: string, patch: PanItemPatch) => void;
  onUpdateCliente: (clienteId: string, patch: ClientePatch) => void;
}) {
  return (
    <section
      className={`flex flex-col rounded-xl border border-hairline bg-surface ${
        dense ? "gap-2 p-3" : "gap-4 p-5"
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={`truncate font-semibold ${dense ? "text-sm" : "text-base"}`}>
          {cliente.cliente}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {cliente.nota1 ? (
            <span
              title="Nota 1"
              className={`inline-flex items-center justify-center rounded-full border border-hairline font-semibold text-ink-secondary uppercase ${
                dense ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]"
              }`}
            >
              {cliente.nota1.slice(0, 2)}
            </span>
          ) : null}
          <StatusSelect
            label="Chofer"
            value={cliente.chofer}
            options={selectOptions(CHOFERES, cliente.chofer)}
            dense={dense}
            onChange={(chofer) => onUpdateCliente(cliente.id, { chofer })}
          />
          <StatusSelect
            label="Distribución"
            value={cliente.distribucion}
            options={selectOptions(DISTRIBUCIONES, cliente.distribucion)}
            dense={dense}
            colorVar={distribucionColor(cliente.distribucion)}
            onChange={(distribucion) => onUpdateCliente(cliente.id, { distribucion })}
          />
        </div>
      </header>

      <div className={`flex flex-col ${dense ? "gap-1" : "gap-2"}`}>
        {cliente.panes.length === 0 ? (
          <p className="text-xs text-ink-muted">Sin panes cargados.</p>
        ) : (
          cliente.panes.map((item) => (
            <PanItemRow
              key={item.id}
              item={item}
              dense={dense}
              onCommit={(patch) => onUpdatePanItem(cliente.id, item.id, patch)}
            />
          ))
        )}
      </div>
    </section>
  );
}
