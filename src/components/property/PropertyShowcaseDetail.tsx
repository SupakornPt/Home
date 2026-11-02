"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Property } from "@/types/property";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SellerContactCard } from "@/components/property/SellerContactCard";
import { ContactForm } from "@/components/property/ContactForm";
import { cn } from "@/lib/cn";

type TileProps = {
  icon: string;
  label: string;
  value: string;
};

function SpecTile({ icon, label, value }: TileProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface-container-low px-2 py-2.5 sm:gap-2 sm:p-3">
      <MaterialIcon name={icon} className="text-xl text-primary sm:text-2xl" aria-hidden />
      <div className="text-center">
        <div className="caption font-bold uppercase text-primary/40">{label}</div>
        <div className="text-[12px] font-medium text-on-surface sm:text-label-sm">{value}</div>
      </div>
    </div>
  );
}

function formatListingPrice(property: Property): ReactNode {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: property.currency,
    maximumFractionDigits: 0,
  });

  try {
    return formatter.format(property.price);
  } catch {
    const sym =
      property.currency === "USD"
        ? "$"
        : property.currency === "EUR"
          ? "€"
          : property.currency;
    return `${sym} ${property.price.toLocaleString()}`;
  }
}

export function PropertyShowcaseDetail({
  property,
  contactAnchorId,
  onDetailsOpenChange,
  active = true,
  fill = false,
}: {
  property: Property;
  contactAnchorId: string;
  onDetailsOpenChange?: (open: boolean) => void;
  active?: boolean;
  /** Grow to fill leftover height and vertically center the spec row. */
  fill?: boolean;
}) {
  const typeLabel = property.propertyType ?? "Residence";
  const floorsLabel =
    property.floors !== undefined
      ? `${property.floors} level${property.floors === 1 ? "" : "s"}`
      : "—";
  const parkingLabel =
    property.parkingSlots !== undefined
      ? `${property.parkingSlots} slot${property.parkingSlots === 1 ? "" : "s"}`
      : "—";

  const description =
    property.listingDescription ??
    property.features.slice(0, 3).join(". ") +
      (property.features.length ? "." : "");

  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!active && detailsOpen) {
      setDetailsOpen(false);
    }
  }, [active, detailsOpen]);

  function toggleDetails() {
    setDetailsOpen((open) => !open);
  }

  useEffect(() => {
    if (!active) return;
    onDetailsOpenChange?.(detailsOpen);
  }, [detailsOpen, onDetailsOpenChange, active]);

  useEffect(() => {
    if (!active) return;
    if (!detailsOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const id = window.setTimeout(() => {
      document
        .getElementById(`${contactAnchorId}-details`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => window.clearTimeout(id);
  }, [detailsOpen, contactAnchorId, active]);

  function scrollToContact() {
    const el = document.getElementById(contactAnchorId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className={cn(
        "bg-surface px-4 md:px-10",
        fill && !detailsOpen
          ? "flex min-h-0 flex-1 flex-col py-3 md:py-4"
          : "shrink-0 space-y-4 py-4 md:py-5",
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-between gap-3 md:flex-row md:items-end",
          fill && !detailsOpen && "shrink-0",
        )}
      >
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-primary/70">
            <MaterialIcon name="location_on" className="text-base text-primary/60" />
            <span className="text-[11px] font-medium uppercase tracking-widest sm:text-label-sm">
              {property.city}
            </span>
          </div>
          <p className="text-caption text-on-surface-variant md:hidden">
            {property.addressLine}
          </p>
          <h2 className="truncate text-headline-md font-semibold tracking-tighter text-primary md:text-headline-lg">
            {property.title}
          </h2>
          <p className="hidden text-body-md text-on-surface-variant md:block">
            {property.addressLine}
          </p>
        </div>
        <div className="shrink-0 text-left md:text-right">
          <div className="text-caption text-on-surface-variant opacity-70">
            Listing price
          </div>
          <div
            className={cn(
              "flex flex-wrap items-baseline gap-1 text-headline-md font-semibold text-primary md:text-headline-lg",
            )}
          >
            {formatListingPrice(property)}
          </div>
        </div>
      </div>

      <div
        className={cn(
          fill && !detailsOpen
            ? "flex min-h-0 flex-1 items-center"
            : "mt-4",
        )}
      >
        <div className="grid w-full grid-cols-6 gap-1.5 py-3 sm:gap-3 sm:py-4">
          <SpecTile icon="house" label="Type" value={typeLabel} />
          <SpecTile icon="stairs" label="Floors" value={floorsLabel} />
          <SpecTile
            icon="bed"
            label="Bedrooms"
            value={`${property.beds} room${property.beds === 1 ? "" : "s"}`}
          />
          <SpecTile
            icon="bathtub"
            label="Bathrooms"
            value={`${property.baths} bath${property.baths === 1 ? "" : "s"}`}
          />
          <SpecTile icon="local_parking" label="Parking" value={parkingLabel} />
          <button
            type="button"
            aria-expanded={detailsOpen}
            aria-controls={`${contactAnchorId}-details`}
            onClick={toggleDetails}
            className="scale-down-click flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#5c5c62] px-2 py-2.5 transition hover:bg-[#505056] sm:gap-2 sm:p-3"
          >
            <MaterialIcon
              name={detailsOpen ? "expand_less" : "info"}
              className="text-xl text-white sm:text-2xl"
              aria-hidden
            />
            <div className="text-center">
              <div className="caption font-bold uppercase text-white/50">More</div>
              <div className="text-[12px] font-medium text-white sm:text-label-sm">
                Information
              </div>
            </div>
          </button>
        </div>
      </div>

      {detailsOpen ? (
        <div id={`${contactAnchorId}-details`} className="space-y-8 pt-2">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="min-w-0 flex-1 space-y-3">
              <h3 className="text-label-sm uppercase tracking-[0.2em] text-primary/50">
                Architectural description
              </h3>
              <p className="max-w-3xl text-body-md leading-relaxed text-on-surface-variant md:text-body-lg">
                {description}
              </p>
              <p className="text-caption uppercase tracking-wide text-on-surface-variant/70">
                {property.areaSqm} m² · {property.features.join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToContact}
              className="group scale-down-click flex w-full shrink-0 items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-[16px] font-semibold text-on-primary shadow-2xl transition hover:bg-primary/90 md:w-64"
            >
              Contact agent
              <MaterialIcon
                name="arrow_forward"
                className="text-xl transition group-hover:translate-x-1"
              />
            </button>
          </div>

          <div
            id={contactAnchorId}
            className="grid scroll-mt-24 gap-8 border-t border-outline-variant/20 pt-8 md:grid-cols-2"
          >
            <SellerContactCard seller={property.seller} />
            <ContactForm propertyId={property.id} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
