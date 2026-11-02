# Components (inventory & responsibilities)

Mapped to **product.md** flows and **design.md** regions. Logic lives in **hooks** or **lib/api**; components remain mostly presentational.

Design reference implementation aligns with **`stitch_home_3d_interactive_showcase`** (see **api.md**, **DESIGN.md** inside that folder).

## Opening experience

| Component | Responsibility |
|-----------|----------------|
| `VideoGate` | Full-viewport muted video every visit; handles `ended`, autoplay fallback. |
| `SkipButton` | Bottom-centered **liquid glass** pill (`liquid-glass-skip` + hover state + light sheen); calls parent `onSkip`; `aria-label` for accessibility. Standalone `<button>` (not `Button` primitive). |

## Main shell

| Component | Responsibility |
|-----------|----------------|
| `HomePage` | Orchestrates gate → main; `desktopFiltersOpen` drives `lg:` left padding (`pl-80` ↔ `pl-0`); **`matchMedia`/layout-sync** derives active filter surface for ARIA on the header toggle; wires hooks, rail, footer, mobile filter sheet. |
| `StitchHeader` | Fixed glass bar: **filter** toolbar button (`filter_list`; toggles **`FilterPanel` / `PropertyFilterSidebar`**), **`aria-expanded`** + **`aria-controls`** wired from parent for the active breakpoint, centered **HOME** wordmark. |
| `SiteFooter` | Stitch-style footer strip: wordmark, legal links, copyright. |

## Property navigation & 3D

| Component | Responsibility |
|-----------|----------------|
| `PropertySwipeDeck` | Horizontal scroll-snap; one full “showcase slide” per property (hero + detail). Syncs scroll with `currentIndex`. |
| `ShowcaseHero` | Large gradient stage (~80vh), rounded 3D frame, glass HUD hint (drag orbit), desktop glass prev/next. |
| `HouseStage` | R3F `Canvas` + lights + `OrbitControls` (rotate drag; zoom/pan off); optional GLB URL from DTO later. |
| `PropertyRailNav` | Bottom glass rail: prev/next listing labels + thumbnails + counter (`picsum.photos` seeded by id until real assets exist). |

## Filters

| Component | Responsibility |
|-----------|----------------|
| `PropertyFiltersFields` | Shared form: city select, query, min/max price, min beds. |
| `PropertyFilterSidebar` | **Desktop (`lg+`):** fixed left **320px** rail (`open` collapses **`translate`** + disables pointer-events); Apply / Clear. |
| `FilterPanel` | **Mobile (&lt;`lg`):** bottom sheet overlay (`id="mobile-property-filters"` for **`aria-controls`**); same fields + Apply / Close. |

## Detail & contact

| Component | Responsibility |
|-----------|----------------|
| `PropertyShowcaseDetail` | Location line, oversized title, **secondary** accent price row, five spec tiles (`propertyType`, `floors`, `beds`, `baths`, `parkingSlots` + fallbacks), `listingDescription`, **Contact agent** scroll anchor. |
| `SellerContactCard` | Listing agent block from DTO. |
| `ContactForm` | Zod-validated inquiry; submits via `submitContact`. |

## Shared UI

| Component | Responsibility |
|-----------|----------------|
| `Button` | Primary / ghost / inverse (used heavily by Skip and legacy patterns). |
| `MaterialIcon` | Thin wrapper around **Material Symbols Outlined** (Google font). |
| **`src/lib/cn.ts`** | Class name join helper for Tailwind. |

## Removed / superseded

- **`AppHeader`** — replaced by `StitchHeader`.
- **`PropertyDetail`** — replaced by `PropertyShowcaseDetail` for Stitch-aligned layout.

## Cross-checks

- **↔ `product.md`:** Video gate, swipe carousel, filters, 3D drag, seller contact—all covered.
- **↔ `state.md`:** `gatePhase`, `filters`, `properties[]`, `currentIndex`, forms map to slices in `HomePage`.
- **↔ `api.md`:** Listing DTO includes optional Stitch fields above; loaders parse with Zod.
