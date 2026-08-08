"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ESTADOS, type Estado, type Lote } from "@/lib/types";

type LoteFormDialogProps = {
  /** `null` opens the dialog in "add" mode. */
  lote: Lote | null;
  /** Existing rows, used for the datalist and the duplicate-code check. */
  lotes: Lote[];
  onSave: (values: Omit<Lote, "id">) => void;
  onClose: () => void;
};

type Errors = Partial<Record<"tipoPan" | "lote" | "unidades", string>>;

export function LoteFormDialog({
  lote,
  lotes,
  onSave,
  onClose,
}: LoteFormDialogProps) {
  const isEdit = lote !== null;
  const formId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [tipoPan, setTipoPan] = useState(lote?.tipoPan ?? "");
  const [codigo, setCodigo] = useState(lote?.lote ?? "");
  const [unidades, setUnidades] = useState(
    lote ? String(lote.unidades) : "",
  );
  const [estado, setEstado] = useState<Estado>(lote?.estado ?? "Programado");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const tiposExistentes = [...new Set(lotes.map((l) => l.tipoPan))].sort();

  function validate(): Errors {
    const next: Errors = {};

    if (!tipoPan.trim()) {
      next.tipoPan = "Indicá el tipo de pan.";
    }

    const codigoLimpio = codigo.trim();
    if (!codigoLimpio) {
      next.lote = "Indicá el código de lote.";
    } else if (
      lotes.some(
        (l) =>
          l.id !== lote?.id &&
          l.lote.toLowerCase() === codigoLimpio.toLowerCase(),
      )
    ) {
      next.lote = "Ya existe un lote con ese código.";
    }

    const cantidad = Number(unidades);
    if (!unidades.trim() || !Number.isFinite(cantidad)) {
      next.unidades = "Indicá la cantidad de unidades.";
    } else if (!Number.isInteger(cantidad) || cantidad < 1) {
      next.unidades = "Debe ser un número entero mayor a cero.";
    }

    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSave({
      tipoPan: tipoPan.trim(),
      lote: codigo.trim(),
      unidades: Number(unidades),
      estado,
    });
  }

  const fieldClass =
    "w-full rounded-lg border border-hairline bg-plane px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        className="max-h-full w-full overflow-y-auto rounded-t-2xl border border-hairline bg-surface p-6 sm:max-w-md sm:rounded-2xl"
      >
        <h2 id={`${formId}-title`} className="text-lg font-semibold">
          {isEdit ? "Editar lote" : "Agregar lote"}
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">
          {isEdit
            ? `Modificá los datos del lote ${lote.lote}.`
            : "Cargá un nuevo lote de producción."}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          <div>
            <label
              htmlFor={`${formId}-tipo`}
              className="mb-1.5 block text-sm font-medium"
            >
              Tipo de pan
            </label>
            <input
              ref={firstFieldRef}
              id={`${formId}-tipo`}
              list={`${formId}-tipos`}
              value={tipoPan}
              onChange={(e) => setTipoPan(e.target.value)}
              placeholder="Pan Blanco"
              aria-invalid={Boolean(errors.tipoPan)}
              className={fieldClass}
            />
            <datalist id={`${formId}-tipos`}>
              {tiposExistentes.map((tipo) => (
                <option key={tipo} value={tipo} />
              ))}
            </datalist>
            <FieldError message={errors.tipoPan} />
          </div>

          <div>
            <label
              htmlFor={`${formId}-lote`}
              className="mb-1.5 block text-sm font-medium"
            >
              Lote
            </label>
            <input
              id={`${formId}-lote`}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="LOT-021"
              aria-invalid={Boolean(errors.lote)}
              className={`${fieldClass} font-mono`}
            />
            <FieldError message={errors.lote} />
          </div>

          <div>
            <label
              htmlFor={`${formId}-unidades`}
              className="mb-1.5 block text-sm font-medium"
            >
              Unidades
            </label>
            <input
              id={`${formId}-unidades`}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={unidades}
              onChange={(e) => setUnidades(e.target.value)}
              placeholder="100"
              aria-invalid={Boolean(errors.unidades)}
              className={`${fieldClass} tabular-nums`}
            />
            <FieldError message={errors.unidades} />
          </div>

          <div>
            <label
              htmlFor={`${formId}-estado`}
              className="mb-1.5 block text-sm font-medium"
            >
              Estado
            </label>
            <select
              id={`${formId}-estado`}
              value={estado}
              onChange={(e) => setEstado(e.target.value as Estado)}
              className={fieldClass}
            >
              {ESTADOS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-hairline px-4 py-2 text-sm font-medium transition-colors hover:bg-plane focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
            >
              {isEdit ? "Guardar cambios" : "Agregar lote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-ink-secondary">{message}</p>;
}
