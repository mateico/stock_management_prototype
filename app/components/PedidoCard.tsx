"use client";

import { useState } from "react";
import {
  CHOFERES,
  DISTRIBUCIONES,
  EMPAQUES,
  type Cliente,
  type PanItem,
} from "@/lib/types";

function selectOptions(known: readonly string[], current: string): string[] {
  return known.includes(current) ? [...known] : [current, ...known];
}

function empaqueColor(value: string): string {
  if (value === "Fin" || value === "Listo") return "var(--good)";
  if (value === "Produccion" || value === "En Proceso") return "var(--warning)";
  return "var(--neutral)";
}

function empaqueBackgroundColor(value: string): string {
  if (value === "Fin" || value === "Listo") return "var(--good-soft)";
  if (value === "Produccion" || value === "En Proceso") return "var(--warning-soft)";
  return "var(--neutral-soft)";
}

function distribucionColor(value: string): string {
  return value === "Entregado" ? "var(--good)" : "var(--neutral)";
}

function distribucionBackgroundColor(value: string): string {
  return value === "Entregado" ? "var(--good-soft)" : "var(--neutral-soft)";
}

function StatusSelect({
  label,
  value,
  options,
  dense,
  colorVar,
  bgColor,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  dense: boolean;
  colorVar?: string;
  bgColor?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={colorVar ? { borderColor: colorVar, color: colorVar, backgroundColor: bgColor } : undefined}
      className={`appearance-none rounded-full border bg-transparent text-center font-medium whitespace-nowrap [text-align-last:center] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
        dense ? "px-3 py-[3px] text-[16.5px]" : "px-2.5 py-1 text-xs"
      } ${colorVar ? "" : "border-hairline text-ink-secondary"}`}
    >
      {options.map((option) => (
        <option key={option} value={option} className="text-center">
          {option || "—"}
        </option>
      ))}
    </select>
  );
}

function NumberEditPopup({
  label,
  initialValue,
  onConfirm,
  onCancel,
}: {
  label: string;
  initialValue: number;
  onConfirm: (value: number) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(String(initialValue));

  function confirm() {
    onConfirm(Math.max(0, parseInt(draft, 10) || 0));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xs rounded-xl border border-hairline bg-surface p-4 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="mb-2 text-sm font-medium text-ink-secondary">{label}</p>
        <input
          type="number"
          min={0}
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === "Enter") confirm();
            if (event.key === "Escape") onCancel();
          }}
          className="w-full rounded-md border border-hairline bg-transparent px-3 py-2 text-right text-lg tabular-nums focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-hairline px-3 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-plane"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirm}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink transition-colors hover:opacity-90"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function EditableNumber({
  value,
  label,
  dense,
  onCommit,
}: {
  value: number;
  label: string;
  dense: boolean;
  onCommit: (value: number) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={label}
        className={`min-w-0 flex-1 text-right tabular-nums ${dense ? "text-[16.5px]" : "text-sm"}`}
      >
        {value}
      </button>
      {editing ? (
        <NumberEditPopup
          label={label}
          initialValue={value}
          onConfirm={(next) => {
            setEditing(false);
            if (next !== value) onCommit(next);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : null}
    </>
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
  return (
    <div
      className={`flex items-center rounded-lg border bg-surface border-hairline ${
        dense ? "gap-3 rounded-xl px-3 py-1.5" : "gap-2 px-3 py-2"
      }`}
    >
      <p
        className={`min-w-0 truncate font-medium ${item.nota2 ? "flex-[2]" : "flex-[4]"} ${
          dense ? "text-lg" : "text-sm"
        }`}
      >
        {item.pan}
      </p>
      {item.nota2 ? (
        <p
          className={`min-w-0 flex-[2] truncate text-ink-muted ${dense ? "text-[15px]" : "text-xs"}`}
        >
          {item.nota2}
        </p>
      ) : null}
      <div
        className={`flex flex-1 items-center justify-end ${dense ? "gap-1.5" : "gap-1"}`}
      >
        <EditableNumber
          value={item.cant}
          label={`Cantidad de ${item.pan}`}
          dense={dense}
          onCommit={(cant) => onCommit({ cant })}
        />
        <span
          className={`text-ink-muted ${dense ? "text-[16.5px]" : "text-sm"}`}
        >
          /
        </span>
        <EditableNumber
          value={item.pqt}
          label={`Paquetes de ${item.pan}`}
          dense={dense}
          onCommit={(pqt) => onCommit({ pqt })}
        />
      </div>
      <StatusSelect
        label={`Empaque de ${item.pan}`}
        value={item.empaque}
        options={selectOptions(EMPAQUES, item.empaque)}
        dense={dense}
        colorVar={empaqueColor(item.empaque)}
        bgColor={empaqueBackgroundColor(item.empaque)}
        onChange={(empaque) => onCommit({ empaque })}
      />
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
  onUpdatePanItem: (
    clienteId: string,
    panItemId: string,
    patch: PanItemPatch,
  ) => void;
  onUpdateCliente: (clienteId: string, patch: ClientePatch) => void;
}) {
  return (
    <section
      className={`flex flex-col border border-hairline bg-cardback break-inside-avoid ${
        dense ? "gap-3 rounded-2xl p-[18px]" : "gap-4 rounded-xl p-5"
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3
          className={`truncate font-semibold ${dense ? "text-[21px]" : "text-base"}`}
        >
          {cliente.cliente}
        </h3>
        <div
          className={`flex flex-wrap items-center ${dense ? "gap-[9px]" : "gap-1.5"}`}
        >
          {cliente.nota1 ? (
            <span
              title="Nota 1"
              className={`inline-flex items-center justify-center rounded-full border border-hairline font-semibold text-ink-secondary uppercase ${
                dense
                  ? "h-[30px] w-[30px] text-[13.5px]"
                  : "h-6 w-6 text-[10px]"
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
            bgColor={distribucionBackgroundColor(cliente.distribucion)}
            onChange={(distribucion) =>
              onUpdateCliente(cliente.id, { distribucion })
            }
          />
        </div>
      </header>

      <div className={`flex flex-col ${dense ? "gap-1.5" : "gap-2"}`}>
        {cliente.panes.length === 0 ? (
          <p className={`text-ink-muted ${dense ? "text-lg" : "text-xs"}`}>
            Sin panes cargados.
          </p>
        ) : (
          <>
            {cliente.panes.map((item) => (
              <PanItemRow
                key={item.id}
                item={item}
                dense={dense}
                onCommit={(patch) =>
                  onUpdatePanItem(cliente.id, item.id, patch)
                }
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
