"use client";

import type { PropertyFilters } from "@/types/property";
import { PropertyFiltersFields } from "@/components/property/PropertyFiltersFields";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type FilterPanelProps = {
  open: boolean;
  onClose: () => void;
  pending: PropertyFilters;
  cityOptions: string[];
  onChange: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => void;
  onApply: () => void;
  onClear: () => void;
};

export function FilterPanel({
  open,
  onClose,
  pending,
  cityOptions,
  onChange,
  onApply,
  onClear,
}: FilterPanelProps) {
  if (!open) return null;

  return (
    <div
      id="mobile-property-filters"
      className="fixed inset-0 z-[60] flex items-end bg-black/40 backdrop-blur-sm lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filter-heading"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-outline-variant/20 bg-surface p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <MaterialIcon name="tune" className="text-primary" aria-hidden />
              <h2 id="mobile-filter-heading" className="text-headline-md font-semibold text-primary">
                Property search
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant opacity-80">
              Refine your selection
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-low"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <PropertyFiltersFields
          pending={pending}
          cityOptions={cityOptions}
          onChange={onChange}
          fieldIdPrefix="mobile"
        />

        <div className="sticky bottom-0 mt-8 flex gap-3 border-t border-outline-variant/20 bg-surface pb-2 pt-4">
          <button
            type="button"
            onClick={() => {
              onClear();
            }}
            className="flex-1 scale-down-click rounded-xl py-3 text-label-sm font-medium text-on-surface-variant transition hover:bg-surface-container-low"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex-[1.4] scale-down-click rounded-xl bg-primary py-3 text-label-sm font-semibold text-on-primary shadow-md"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
