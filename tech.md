# Technology: HOME

## Principles (from project starter)

- **TypeScript** strict mode; **no `any`** (use `unknown` + narrowing or explicit DTO types).
- **Tailwind CSS** for styling; **mobile-first** breakpoints.
- **Separation:** UI components vs hooks/services (data fetch, filter logic, 3D setup helpers).
- **Clean architecture:** domain types and API adapters isolated from React tree details.
- **Configuration:** URLs, feature flags, and API base path via env—not hardcoded in components.

## Recommended stack

| Layer | Choice | Rationale |
|--------|--------|------------|
| Framework | **Next.js** (App Router) | In use (`src/app`); SSR & static export optional. |
| UI | **React 19 / React 18+** | Matches installed stack; hooks for gate + carousel. |
| Typography | **Inter** via `next/font/google` | Stitch / SF analogue; deterministic webfont loading. |
| Icons | **Material Symbols Outlined** (CSS `@import` in `globals.css`) | Matches Stitch comps (filter list header, sidebar tune motif, location, arrows, specs). |
| Styling | **Tailwind CSS** | Extended Stitch tokens (`surface`, `secondary`, `display-xl`, `margin-desktop`, etc.). |
| 3D | **React Three Fiber** + **Three.js** | Declarative scenes; drag-orbit controls via `@react-three/drei` `OrbitControls` (constraints: no zoom if product wants rotate-only—configurable). |
| Gestures | Native **CSS scroll-snap** horizontal deck | Implemented in `PropertySwipeDeck`; optional keyboard via `useSwipeNavigation`. |
| Forms | Native + **Zod** for client validation | Typed schemas align with strict TS. |
| Data | Fetch to REST/JSON in phase 1 | Replaceable adapter; see `api.md`. |

## Video (opening)

- HTML5 `<video>`: `muted`, `playsInline`, `autoPlay` (with fallback play button if autoplay blocked).
- Asset: `video_opening.mp4` served from `public/` or CDN URL from env.
- **No audio track** required; ensure `muted` always for autoplay policy.

## 3D assets

- **glTF / GLB** per property, URL in listing DTO.
- Use **Draco** compression optional for performance (decision at implementation).

## Quality gates

- **ESLint** + **TypeScript** `strict`.
- **Prettier** (optional) consistent with team.
- **Lint rule:** `@typescript-eslint/no-explicit-any` error.

## Presentational utilities (`globals.css`)

- **`.glass`** — shared backdrop blur for chrome / overlays.
- **`.liquid-glass-skip`** — **Skip** on the opening video: translucent gradient capsule, **`backdrop-filter: blur` + saturate**, thin border, inset highlight (see **`SkipButton.tsx`**).
- **`.scale-down-click`** — `active` micro-scale affordance.

## Performance

- Lazy-load Three.js chunk for main view after video gate closes.
- `Suspense` boundaries around 3D canvas.
- Image/video poster optional for 3D while loading.

## Cross-checks

- **↔ `structure.md`:** Folders mirror separation (components vs lib vs types).
- **↔ `api.md`:** Fetch layer typed with shared DTOs.
