"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { VideoGate } from "@/components/opening/VideoGate";
import { StitchHeader } from "@/components/layout/StitchHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PropertyFilterSidebar } from "@/components/property/PropertyFilterSidebar";
import { FilterPanel } from "@/components/property/FilterPanel";
import { PropertySwipeDeck } from "@/components/property/PropertySwipeDeck";
import { PropertyRailNav } from "@/components/property/PropertyRailNav";
import { useOpeningGate } from "@/hooks/useOpeningGate";
import { useProperties } from "@/hooks/useProperties";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

export function HomePage() {
  const {
    gatePhase,
    enterMain,
    videoAutoplayBlocked,
    onVideoPlayFailed,
    onVideoPlaying,
  } = useOpeningGate();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(true);
  const [isLgViewport, setIsLgViewport] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsLgViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const {
    properties,
    cityOptions,
    pendingFilters,
    setPendingFilterField,
    commitFilters,
    clearFilters,
    loadStatus,
    loadError,
    currentIndex,
    setCurrentIndex,
    goNext,
    goPrev,
    hasNext,
    hasPrev,
  } = useProperties();

  const onKeyNext = useCallback(() => {
    if (hasNext) goNext();
  }, [hasNext, goNext]);

  const onKeyPrev = useCallback(() => {
    if (hasPrev) goPrev();
  }, [hasPrev, goPrev]);

  useSwipeNavigation(gatePhase === "main", onKeyNext, onKeyPrev);

  const handleHeaderFilterToggle = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setDesktopFiltersOpen((prev) => {
        const next = !prev;
        if (typeof requestAnimationFrame === "undefined") return next;
        if (next) {
          requestAnimationFrame(() => {
            const sidebar = document.getElementById("desktop-property-filters");
            const focusTarget = sidebar?.querySelector<
              HTMLInputElement | HTMLSelectElement
            >("input, select");
            focusTarget?.focus();
          });
        }
        return next;
      });
      return;
    }
    setMobileFiltersOpen((o) => !o);
  }, []);

  const filtersExpanded = isLgViewport ? desktopFiltersOpen : mobileFiltersOpen;
  const filterPanelAriaControls = isLgViewport
    ? "desktop-property-filters"
    : mobileFiltersOpen
      ? "mobile-property-filters"
      : undefined;

  if (gatePhase === "video") {
    return (
      <div className="min-h-dvh bg-black">
        <VideoGate
          onComplete={enterMain}
          onPlayFailed={onVideoPlayFailed}
          onPlaying={onVideoPlaying}
          autoplayBlocked={videoAutoplayBlocked}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-background text-on-surface",
        detailsExpanded
          ? "min-h-dvh overflow-y-auto"
          : "h-dvh overflow-hidden",
      )}
    >
      <PropertyFilterSidebar
        open={desktopFiltersOpen}
        pending={pendingFilters}
        cityOptions={cityOptions}
        onChange={setPendingFilterField}
        onApply={commitFilters}
        onClear={() => {
          clearFilters();
        }}
      />

      <div
        className={cn(
          "flex flex-col transition-[padding] duration-300 ease-out",
          detailsExpanded ? "min-h-dvh" : "h-dvh",
          desktopFiltersOpen ? "lg:pl-80" : "lg:pl-0",
        )}
      >
        <StitchHeader
          onFilterPress={handleHeaderFilterToggle}
          filtersExpanded={filtersExpanded}
          filterPanelAriaControls={filterPanelAriaControls}
        />

        <main className="relative flex min-h-0 flex-1 flex-col pt-14">
          <div aria-live="polite" className="sr-only">
            {loadStatus === "success"
              ? `Showing property ${currentIndex + 1} of ${properties.length}`
              : null}
          </div>

          {loadStatus === "loading" && properties.length === 0 ? (
            <div className="mx-margin-mobile flex flex-1 items-center justify-center rounded-3xl bg-surface-container-low text-center text-body-md text-on-surface-variant md:mx-margin-desktop">
              Loading listings…
            </div>
          ) : null}

          {loadStatus === "loading" && properties.length > 0 ? (
            <p className="mx-auto max-w-container-max px-margin-mobile pb-2 text-caption text-on-surface-variant opacity-75 md:px-margin-desktop">
              Updating results…
            </p>
          ) : null}

          {loadStatus === "error" && loadError ? (
            <div className="mx-margin-mobile flex flex-1 items-center justify-center rounded-3xl border border-red-100 bg-error-container px-6 py-8 text-center text-body-md text-on-error-container md:mx-margin-desktop">
              {loadError}
            </div>
          ) : null}

          {loadStatus === "success" ? (
            <>
              <PropertyRailNav
                properties={properties}
                currentIndex={currentIndex}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onNext={() => {
                  goNext();
                  setDetailsExpanded(false);
                }}
                onPrev={() => {
                  goPrev();
                  setDetailsExpanded(false);
                }}
              />
              <PropertySwipeDeck
                properties={properties}
                currentIndex={currentIndex}
                onIndexChange={(index) => {
                  setCurrentIndex(index);
                  setDetailsExpanded(false);
                }}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onNext={() => {
                  goNext();
                  setDetailsExpanded(false);
                }}
                onPrev={() => {
                  goPrev();
                  setDetailsExpanded(false);
                }}
                onDetailsOpenChange={setDetailsExpanded}
                viewportLocked={!detailsExpanded}
              />
            </>
          ) : null}
        </main>

        <SiteFooter />
      </div>

      <FilterPanel
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        pending={pendingFilters}
        cityOptions={cityOptions}
        onChange={setPendingFilterField}
        onApply={commitFilters}
        onClear={() => {
          clearFilters();
          setMobileFiltersOpen(false);
        }}
      />
    </div>
  );
}
