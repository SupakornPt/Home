"use client";

import type { Seller } from "@/types/property";

type SellerContactCardProps = {
  seller: Seller;
};

export function SellerContactCard({ seller }: SellerContactCardProps) {
  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <h3 className="text-label-sm font-semibold uppercase tracking-wide text-primary/50">
        Listed by
      </h3>
      <p className="mt-2 text-lg font-semibold text-primary">{seller.name}</p>
      {seller.company ? (
        <p className="text-body-md text-on-surface-variant">{seller.company}</p>
      ) : null}
      <div className="mt-4 space-y-2 text-body-md text-on-surface">
        <p>
          <a
            className="underline decoration-outline-variant underline-offset-[6px] transition hover:text-secondary hover:decoration-secondary"
            href={`mailto:${seller.email}`}
          >
            {seller.email}
          </a>
        </p>
        <p>
          <a
            className="underline decoration-outline-variant underline-offset-[6px] transition hover:text-secondary hover:decoration-secondary"
            href={`tel:${seller.phone.replace(/\s/g, "")}`}
          >
            {seller.phone}
          </a>
        </p>
      </div>
    </div>
  );
}
