"use client";

import { useSyncExternalStore } from "react";

// Grid mode fits every card on one non-scrolling screen. Below this it has to
// shrink past the point of being readable, so it isn't offered at all — height
// matters as much as width, since that's what the fit scales against.
export const GRID_MIN_WIDTH_PX = 1300;
export const GRID_MIN_HEIGHT_PX = 768;

const QUERY = `(min-width: ${GRID_MIN_WIDTH_PX}px) and (min-height: ${GRID_MIN_HEIGHT_PX}px)`;

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** SSR-safe: defaults to false (no grid) until mounted, to avoid hydration mismatch. */
export function useCanUseGrid(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
