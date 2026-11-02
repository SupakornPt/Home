"use client";

import type { PropertyFilters } from "@/types/property";
import { PropertyFiltersFields } from "@/components/property/PropertyFiltersFields";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/cn";

type PropertyFilterSidebarProps = {
  open: boolean;
  pending: PropertyFilters;
  cityOptions: string[];
  onChange: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => void;
  onApply: () => void;
  onClear: () => void;
};

export function PropertyFilterSidebar({
  open,
  pending,
  cityOptions,
  onChange,
  onApply,
  onClear,
}: PropertyFilterSidebarProps) {
  return (
    <aside
      id="desktop-property-filters"
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-dvh w-80 flex-col border-r border-outline-variant/40 bg-surface/95 shadow-2xl backdrop-blur-2xl transition-[transform] duration-300 ease-out lg:flex",
        open
          ? "lg:translate-x-0 lg:pointer-events-auto"
          : "lg:pointer-events-none lg:-translate-x-full",
      )}
      aria-labelledby="desktop-filter-heading"
      aria-hidden={!open}
    >
      <div className="flex shrink-0 items-center px-8 pt-[0.5cm] pb-2">
        <div className="flex w-full items-center justify-between gap-3">
          <h2 id="desktop-filter-heading" className="text-headline-md font-semibold tracking-tight text-primary">
            Property search
          </h2>
          <MaterialIcon
            name="tune"
            className="text-on-surface-variant"
            aria-hidden
          />
        </div>
      </div>
      <p className="px-8 pb-4 text-body-md text-on-surface-variant opacity-80">
        Refine your selection
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto px-8">
        <PropertyFiltersFields
          pending={pending}
          cityOptions={cityOptions}
          onChange={onChange}
          fieldIdPrefix="desktop"
        />
      </div>
      <div className="flex shrink-0 flex-col gap-2 border-t border-outline-variant/25 bg-surface/90 px-8 py-4 backdrop-blur-md">
        <button
          type="button"
          onClick={onClear}
          className="scale-down-click w-full rounded-xl py-3 text-label-sm font-medium text-on-surface-variant transition hover:bg-surface-container-low"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={onApply}
          className="scale-down-click w-full rounded-xl bg-primary py-4 text-[16px] font-semibold text-on-primary shadow-lg shadow-black/10 transition hover:bg-primary/90"
        >
          Apply filters
        </button>
      </div>
    </aside>
  );
}
