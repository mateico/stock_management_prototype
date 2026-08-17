"use client";

import { useLayoutEffect, useRef } from "react";

import type { Cliente } from "@/lib/types";
import { PedidoCard, type ClientePatch, type PanItemPatch } from "./PedidoCard";

const MIN_COLUMNS = 3;
const MAX_COLUMNS = 7;
const MIN_SCALE = 0.55;
const COLUMN_GAP_PX = 12;
// Below this, a 4th column would be too narrow to read at scale 1 (e.g. a
// phone screen with the grid view forced on) — start narrower instead.
// (1.5x the base card size, so columns stay proportionate to the bigger cards.)
const MIN_READABLE_COLUMN_PX = 450;
// On-screen column width floor: scale shrinks font/padding, but a column
// physically narrower than this can't hold a card's content at all — better
// to stop adding columns and clip vertically instead of mangling every card.
const MIN_ONSCREEN_COLUMN_PX = 270;

/**
 * Column-flow grid (cards stack top-to-bottom per column, like the sketch)
 * that never scrolls: it measures its own content and shrinks a CSS
 * transform (font, borders, paddings all scale together) and/or adds
 * columns until everything fits the available height. Zero-scroll can't be
 * guaranteed for an unbounded number of pedidos — beyond MAX_COLUMNS at
 * MIN_SCALE, content is clipped rather than pushed into a scrollbar.
 */
export function PedidoGrid({
  clientes,
  onUpdatePanItem,
  onUpdateCliente,
}: {
  clientes: Cliente[];
  onUpdatePanItem: (clienteId: string, panItemId: string, patch: PanItemPatch) => void;
  onUpdateCliente: (clienteId: string, patch: ClientePatch) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    function fit() {
      if (!container || !content) return;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      if (containerWidth === 0 || containerHeight === 0) return;

      const startColumns = Math.max(
        1,
        Math.min(MIN_COLUMNS, Math.floor(containerWidth / MIN_READABLE_COLUMN_PX)),
      );
      const maxColumns = Math.max(
        startColumns,
        Math.min(MAX_COLUMNS, Math.floor(containerWidth / MIN_ONSCREEN_COLUMN_PX)),
      );
      let columns = startColumns;
      let scale = 1;

      for (let attempt = 0; attempt < maxColumns - startColumns + 1; attempt += 1) {
        content.style.transform = "none";
        content.style.width = `${containerWidth}px`;
        content.style.columnCount = String(columns);

        const naturalHeight = content.scrollHeight;
        scale = Math.min(1, containerHeight / naturalHeight);

        if (scale >= MIN_SCALE || columns >= maxColumns) break;
        columns += 1;
      }

      scale = Math.max(MIN_SCALE, scale);

      // Inflate the unscaled width so the transform-scaled result still
      // spans the container, then re-check once: a wider column can wrap
      // text differently, shifting height a bit.
      content.style.width = `${containerWidth / scale}px`;
      const reflowedHeight = content.scrollHeight;
      if (reflowedHeight * scale > containerHeight) {
        scale = Math.max(MIN_SCALE, containerHeight / reflowedHeight);
        content.style.width = `${containerWidth / scale}px`;
      }

      content.style.transformOrigin = "top left";
      content.style.transform = `scale(${scale})`;
    }

    fit();

    const observer = new ResizeObserver(() => fit());
    observer.observe(container);

    return () => observer.disconnect();
  }, [clientes]);

  return (
    <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden">
      <div
        ref={contentRef}
        style={{ columnGap: `${COLUMN_GAP_PX}px` }}
      >
        {clientes.map((cliente) => (
          <div key={cliente.id} className="mb-3 break-inside-avoid">
            <PedidoCard
              cliente={cliente}
              dense
              onUpdatePanItem={onUpdatePanItem}
              onUpdateCliente={onUpdateCliente}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
