"use client";

import { useEffect, useRef, type UIEvent } from "react";
import type { Property } from "@/types/property";
import { ShowcaseHero } from "@/components/property/ShowcaseHero";
import { PropertyShowcaseDetail } from "@/components/property/PropertyShowcaseDetail";

type PropertySwipeDeckProps = {
  properties: Property[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onDetailsOpenChange?: (open: boolean) => void;
  viewportLocked?: boolean;
};

export function PropertySwipeDeck({
  properties,
  currentIndex,
  onIndexChange,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  onDetailsOpenChange,
  viewportLocked = true,
}: PropertySwipeDeckProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ignoreScrollRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || properties.length === 0) return;
    let unlock = 0;

    const apply = () => {
      const w = el.clientWidth;
      if (w <= 0) return;
      const target = currentIndex * w;
      if (Math.abs(el.scrollLeft - target) <= 2) return;
      ignoreScrollRef.current = true;
      el.scrollTo({ left: target, behavior: "auto" });
      window.clearTimeout(unlock);
      unlock = window.setTimeout(() => {
        ignoreScrollRef.current = false;
      }, 160);
    };

    apply();
    const id = requestAnimationFrame(apply);
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(unlock);
      ro.disconnect();
    };
  }, [currentIndex, properties.length]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (ignoreScrollRef.current) return;
    const el = e.currentTarget;
    const w = el.clientWidth;
    if (w <= 0 || properties.length === 0) return;
    const idx = Math.round(el.scrollLeft / w);
    const clamped = Math.max(0, Math.min(idx, properties.length - 1));
    if (clamped !== currentIndex) {
      onIndexChange(clamped);
      onDetailsOpenChange?.(false);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-outline-variant/60 bg-surface-container-low py-16 text-center text-body-md text-on-surface-variant">
        No homes match these filters.
      </div>
    );
  }

  return (
    <div className={viewportLocked ? "flex min-h-0 flex-1 flex-col" : "flex flex-col"}>
      <div
        ref={scrollerRef}
        data-property-deck
        onScroll={onScroll}
        className={
          viewportLocked
            ? "flex min-h-0 w-full flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "flex w-full snap-x snap-mandatory overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        }
      >
        {properties.map((property, index) => (
          <article
            key={property.id}
            className={
              viewportLocked
                ? "flex h-full min-h-0 w-full min-w-full shrink-0 snap-start snap-always flex-col"
                : "flex w-full min-w-full shrink-0 snap-start snap-always flex-col"
            }
          >
            <ShowcaseHero
              modelUrl={property.modelUrl}
              hasPrev={hasPrev}
              hasNext={hasNext}
              onPrev={onPrev}
              onNext={onNext}
              fill={viewportLocked}
            />
            <PropertyShowcaseDetail
              property={property}
              contactAnchorId={`contact-${property.id}`}
              active={index === currentIndex}
              fill={viewportLocked}
              onDetailsOpenChange={
                index === currentIndex ? onDetailsOpenChange : undefined
              }
            />
          </article>
        ))}
      </div>
    </div>
  );
}
