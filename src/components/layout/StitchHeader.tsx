"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";

type StitchHeaderProps = {
  /** Toggles filters: mobile sheet, desktop filter sidebar rail. */
  onFilterPress: () => void;
  /** Reflects whether a filter panel is currently open for the active breakpoint (sidebar or sheet). */
  filtersExpanded: boolean;
  /** ID of the open filter surface for assistive tech, when applicable. */
  filterPanelAriaControls?: string;
};

export function StitchHeader({
  onFilterPress,
  filtersExpanded,
  filterPanelAriaControls,
}: StitchHeaderProps) {
  return (
    <header className="nav-glass fixed top-0 z-50 grid w-full grid-cols-3 items-center px-margin-mobile py-2.5 md:px-margin-desktop">
      <div className="flex items-center justify-start gap-2">
        <button
          type="button"
          aria-label={filtersExpanded ? "Close filters" : "Open filters"}
          aria-expanded={filtersExpanded}
          {...(filterPanelAriaControls
            ? { "aria-controls": filterPanelAriaControls }
            : {})}
          onClick={onFilterPress}
          className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-low"
        >
          <MaterialIcon name="filter_list" className="text-2xl" />
        </button>
      </div>

      <div className="flex items-center justify-center">
        <h1 className="text-[clamp(1.05rem,2.2vw,1.35rem)] font-black tracking-tighter text-primary">
          HOME
        </h1>
      </div>

      <div className="flex items-center justify-end gap-2">
        <span
          className="rounded-full p-2 text-primary opacity-70"
          aria-hidden
          role="presentation"
        >
          <MaterialIcon name="account_circle" className="text-2xl" />
        </span>
      </div>
    </header>
  );
}
