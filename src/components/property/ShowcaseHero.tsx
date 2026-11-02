"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/cn";
import type { HouseStageHandle } from "@/components/three/HouseStage";

const HouseStage = dynamic(() => import("@/components/three/HouseStage"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-0 w-full items-center justify-center bg-surface text-caption text-on-surface-variant">
      Loading 3D…
    </div>
  ),
});

const ORBIT_HINT_MS = 3000;

type ShowcaseHeroProps = {
  modelUrl?: string;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** When true, fills remaining vertical space in a viewport-locked layout. */
  fill?: boolean;
};

export function ShowcaseHero({
  modelUrl = "",
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  fill = true,
}: ShowcaseHeroProps) {
  const stageRef = useRef<HouseStageHandle>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  const showOrbitHint = () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setHintVisible(true);
    hintTimerRef.current = setTimeout(() => {
      setHintVisible(false);
      hintTimerRef.current = null;
    }, ORBIT_HINT_MS);
  };

  const hideOrbitHint = () => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    setHintVisible(false);
  };

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden bg-surface",
        fill ? "min-h-0 flex-[1.75]" : "h-[46vh] min-h-[280px] shrink-0",
      )}
      aria-label="Interactive 3D model"
      onMouseEnter={showOrbitHint}
      onMouseLeave={hideOrbitHint}
    >
      <div className="stage-frame-fade relative h-full w-full touch-none overscroll-none">
        <HouseStage ref={stageRef} modelUrl={modelUrl} />
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 select-none items-center gap-2 rounded-full border border-white/40 bg-white/55 px-3 py-1.5 shadow-md backdrop-blur-md transition-opacity duration-300",
          hintVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="rounded-full bg-white/15 p-1 text-primary opacity-70">
          <MaterialIcon name="rotate_left" className="text-sm" aria-hidden />
        </span>
        <div className="h-3 w-px bg-primary/20" />
        <span className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface opacity-75">
          drag to orbit · scroll to zoom
        </span>
        <div className="h-3 w-px bg-primary/20" />
        <span className="rounded-full bg-white/15 p-1 text-primary opacity-70">
          <MaterialIcon name="rotate_right" className="text-sm" aria-hidden />
        </span>
      </div>

      <div className="absolute right-4 bottom-14 z-20 flex w-12 flex-col items-center gap-2 md:right-10">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => stageRef.current?.zoomIn()}
          className="scale-down-click flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/40 shadow-lg backdrop-blur-md transition hover:bg-white/70"
        >
          <MaterialIcon name="add" className="text-xl" />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => stageRef.current?.zoomOut()}
          className="scale-down-click flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/40 shadow-lg backdrop-blur-md transition hover:bg-white/70"
        >
          <MaterialIcon name="remove" className="text-xl" />
        </button>
      </div>

      <button
        type="button"
        aria-label="Previous property"
        disabled={!hasPrev}
        onClick={onPrev}
        className={cn(
          "scale-down-click pointer-events-auto absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/70 shadow-xl backdrop-blur-md transition hover:bg-white md:left-10",
          !hasPrev && "cursor-not-allowed opacity-40",
        )}
      >
        <MaterialIcon name="arrow_back_ios" className="text-xl" />
      </button>
      <button
        type="button"
        aria-label="Next property"
        disabled={!hasNext}
        onClick={onNext}
        className={cn(
          "scale-down-click pointer-events-auto absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/70 shadow-xl backdrop-blur-md transition hover:bg-white md:right-10",
          !hasNext && "cursor-not-allowed opacity-40",
        )}
      >
        <MaterialIcon name="arrow_forward_ios" className="text-xl" />
      </button>
    </div>
  );
}
