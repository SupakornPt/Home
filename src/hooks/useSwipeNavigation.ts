"use client";

import { useEffect } from "react";

/** Desktop: arrow keys mirror horizontal swipe (left = previous, right = next). */
export function useSwipeNavigation(
  enabled: boolean,
  onNext: () => void,
  onPrev: () => void,
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        onNext();
      }
      if (e.key === "ArrowLeft") {
        onPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onNext, onPrev]);
}
