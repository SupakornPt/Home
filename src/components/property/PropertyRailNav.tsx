"use client";

import type { Property } from "@/types/property";
import { cn } from "@/lib/cn";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

function thumbSrc(id: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/128/96`;
}

export function PropertyRailNav({
  properties,
  currentIndex,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: {
  properties: Property[];
  currentIndex: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (properties.length === 0) return null;

  const prev = currentIndex > 0 ? properties[currentIndex - 1] : undefined;
  const next =
    currentIndex < properties.length - 1 ? properties[currentIndex + 1] : undefined;

  return (
    <div className="w-full shrink-0 px-margin-mobile pb-2 pt-[calc(0.5rem+0.5cm)] md:px-margin-desktop md:pb-2.5 md:pt-[calc(0.625rem+0.5cm)]">
      <div className="mx-auto flex w-full max-w-container-max flex-col items-center gap-2 rounded-2xl border border-white/50 bg-white/55 px-2.5 py-2 shadow-md backdrop-blur-md md:flex-row md:justify-between md:rounded-full md:px-5 md:py-2">
        <button
          type="button"
          aria-label={`Previous listing: ${prev?.title ?? ""}`}
          disabled={!hasPrev}
          onClick={onPrev}
          className={cn(
            "group flex w-full min-w-0 cursor-pointer items-center justify-center gap-2 text-left md:max-w-[min(100%,225px)] md:justify-start",
            !hasPrev && "cursor-not-allowed opacity-45",
          )}
        >
          <MaterialIcon
            name="arrow_back_ios"
            className="text-base text-primary/70 group-hover:text-primary md:text-lg"
          />
          <div className="relative h-8 w-9 shrink-0 overflow-hidden rounded-lg shadow-sm md:h-9 md:w-11">
            {prev ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbSrc(prev.id)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-surface-container-high" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-label-sm font-semibold text-primary md:text-body-md">
              {prev?.title ?? "—"}
            </p>
          </div>
        </button>

        <div className="flex shrink-0 flex-col items-center px-1">
          <div className="text-base font-bold text-primary tabular-nums md:text-lg">
            <span>{currentIndex + 1}</span>
            <span className="mx-1 text-primary/30">/</span>
            <span className="text-primary/30">{properties.length}</span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-primary/40">
            Properties
          </span>
        </div>

        <button
          type="button"
          aria-label={`Next listing: ${next?.title ?? ""}`}
          disabled={!hasNext}
          onClick={onNext}
          className={cn(
            "group flex w-full min-w-0 cursor-pointer items-center justify-center gap-2 text-right md:max-w-[min(100%,225px)] md:justify-end",
            !hasNext && "cursor-not-allowed opacity-45",
          )}
        >
          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-label-sm font-semibold text-primary md:text-body-md">
              {next?.title ?? "—"}
            </p>
          </div>
          <div className="relative h-8 w-9 shrink-0 overflow-hidden rounded-lg shadow-sm md:h-9 md:w-11">
            {next ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbSrc(next.id)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-surface-container-high" aria-hidden />
            )}
          </div>
          <MaterialIcon
            name="arrow_forward_ios"
            className="text-base text-primary/70 group-hover:text-primary md:text-lg"
          />
        </button>
      </div>
    </div>
  );
}
