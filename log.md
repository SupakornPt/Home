# Change log — HOME

---

- [INIT]
  Type: system
  Action: create
  File: log.md
  Description: initialized change log system with tracking, breaking detection, and PR integration
  Reason: enable structured AI development workflow
  Impact: affects all future development tracking
  Breaking: NO

---

- [2026-05-11 14:00]
  Type: feature
  Action: create
  File: product.md
  Description: documented vision, goals, user-confirmed behaviors (3D orbit, fullscreen muted video with skip every visit, single-page swipe between properties, filters, standard detail, seller contact, Apple-like HOME brand)
  Reason: complete validation answers and lock product scope for downstream docs
  Impact: product, design, components, API, state
  Breaking: NO

---

- [2026-05-11 14:00]
  Type: ux
  Action: create
  File: personas.md
  Description: added three personas (mobile buyer, desktop viewer, listing coordinator) with implications for layout, 3D, filters, and contact
  Reason: ground UX decisions in concrete users per starter workflow
  Impact: design.md alignment, acceptance criteria for interactions
  Breaking: NO

---

- [2026-05-11 14:00]
  Type: ux
  Action: create
  File: design.md
  Description: defined Apple-inspired art direction, gate/main layout, swipe and filter patterns, 3D stage behavior, typography, a11y, responsive breakpoints
  Reason: translate product + personas into visual and interaction spec
  Impact: component structure, Tailwind layout choices
  Breaking: NO

---

- [2026-05-11 14:02]
  Type: ux
  Action: update
  File: design.md
  Description: replaced symbolic breakpoint notation with plain “below 768px” wording
  Reason: keep markdown readable without HTML escapes
  Impact: documentation only
  Breaking: NO

---

- [2026-05-11 14:00]
  Type: system
  Action: create
  File: tech.md
  Description: specified strict TypeScript, Tailwind, React/Next default, R3F/Three for GLB, video attributes, gestures, Zod, lint and performance notes
  Reason: align implementation stack with starter rules and 3D/video needs
  Impact: repo tooling, dependency choices, build config
  Breaking: NO

---

- [2026-05-11 14:00]
  Type: system
  Action: create
  File: structure.md
  Description: proposed `src/` tree (app, components by domain, hooks, lib/api, types) and public video placement
  Reason: enforce separation of UI, hooks, and API per starter
  Impact: future file placement and imports
  Breaking: NO

---

- [2026-05-11 14:00]
  Type: feature
  Action: create
  File: component.md
  Description: inventoried components for video gate, swipe deck, 3D stage, filters, detail, contact, and shared UI with responsibility boundaries
  Reason: map product flows to buildable units
  Impact: implementation task breakdown, testing matrix
  Breaking: NO

---

- [2026-05-11 14:00]
  Type: feature
  Action: create
  File: api.md
  Description: defined Property, Seller, PropertyFilters DTOs; GET /properties with query filters; POST contact; mock swap strategy
  Reason: typed contract between UI and backend or static JSON phase
  Impact: hooks, forms, list rendering
  Breaking: NO

---

- [2026-05-11 14:00]
  Type: feature
  Action: create
  File: state.md
  Description: modeled gate phase, catalog/index, filters/load status, 3D load flag, contact submit state, derived selectors and implementation hint
  Reason: connect UI to API without ad hoc globals
  Impact: state management choice, reducer/events
  Breaking: NO

---

- [2026-05-11 23:30]
  Type: system
  Action: create
  File: package.json, tsconfig.json, next.config.ts, next-env.d.ts, postcss.config.mjs, tailwind.config.ts, eslint.config.mjs, .gitignore
  Description: added Next.js 15 + React 19, Tailwind 3, ESLint flat config with no-explicit-any, strict TypeScript paths for @/*
  Reason: implement tech.md baseline for HOME app
  Impact: build, lint, dependency graph
  Breaking: NO

---

- [2026-05-11 23:30]
  Type: feature
  Action: create
  File: src/types, src/lib (api, schemas, constants), public/data/properties.json, public/video_opening.mp4
  Description: Zod-backed property DTOs, mock JSON catalog, client-side filter helper, getProperties/submitContact adapters with optional NEXT_PUBLIC_API_BASE, opening video in public
  Reason: deliver api.md mock phase and opening asset path
  Impact: data loading, validation, env-based backend swap
  Breaking: NO

---

- [2026-05-11 23:30]
  Type: feature
  Action: create
  File: src/hooks, src/components, src/app
  Description: useOpeningGate, useProperties, useSwipeNavigation; VideoGate/Skip, AppHeader, FilterPanel, PropertySwipeDeck, PropertyDetail, SellerContactCard, ContactForm; dynamic R3F HouseStage with orbit drag; HomePage shell and layout metadata
  Reason: implement product flows (fullscreen muted video + skip, 3D orbit, swipe between listings, filters, seller contact) with Apple-like layout
  Impact: user-facing behavior, accessibility controls, keyboard arrows for deck
  Breaking: NO

---

- [2026-05-11 23:45]
  Type: fix
  Action: update
  File: VideoGate.tsx, ContactForm.tsx, FilterPanel.tsx, HomePage.tsx, property.ts (schemas)
  Description: z-index so Skip stays above tap-to-play; numeric filter guards against NaN; stable keyboard nav callbacks; FormEvent import; removed unused propertyFiltersSchema export
  Reason: polish edge cases and TypeScript hygiene
  Impact: opening UX, filter apply, keyboard listener churn
  Breaking: NO

---

- [2026-05-11 23:59]
  Type: system
  Action: update
  File: log.md
  Description: recorded failed local npm/npx runs (create-next-app, npm install, npx next build): exit 1 with UNABLE_TO_VERIFY_LEAF_SIGNATURE against registry.npmjs.org; npx also showed EPERM cleanup under npm-cache
  Reason: environment TLS trust (e.g. proxy/SSL inspection) or file locks—not application source errors
  Impact: install/build must succeed on a machine with working registry TLS or proper cafile; optional npx cache cleanup
  Breaking: NO

---

- [2026-05-12 01:40]
  Type: system
  Action: update
  File: node_modules, package-lock.json
  Description: npm install succeeded (465 packages); EBADENGINE warning for eslint-visitor-keys vs Node v20.17.0
  Reason: registry TLS/environment now allows npm fetch
  Impact: local dev and CI can install dependencies
  Breaking: NO

---

- [2026-05-12 01:40]
  Type: system
  Action: update
  File: .next (build output)
  Description: next build completed successfully (Next.js 15.5.18)
  Reason: verify production compile after install
  Impact: confirms app is buildable
  Breaking: NO

---

- [2026-05-12 14:45]
  Type: ux
  Action: update
  File: tailwind.config.ts, globals.css, layout.tsx, HomePage.tsx, FilterPanel.tsx, StitchHeader.tsx, SiteFooter.tsx, PropertyFilterSidebar.tsx, PropertyFiltersFields.tsx, ShowcaseHero.tsx, PropertyShowcaseDetail.tsx, PropertyRailNav.tsx, PropertySwipeDeck.tsx, ContactForm.tsx, SellerContactCard.tsx, HouseStage.tsx, types/property.ts, schemas/property.ts, public/data/properties.json
  Description: aligned UI with stitch_home_3d_interactive_showcase (design tokens, glass header, lg fixed filter sidebar, mobile filter sheet, large gradient 3D stage + HUD chips, Stitch-style detail/spec grid, dual nav glass rail, footer); Inter + Material Symbols; extended Property schema for showcase fields (propertyType, floors, parkingSlots, listingDescription)
  Reason: implement user-requested Stitch reference while preserving opening video gate, carousel swipe, hooks, API
  Impact: entire main layout and property presentation; removed unused AppHeader and PropertyDetail
  Breaking: NO (optional JSON fields with Zod optional)

---

- [2026-05-12 15:05]
  Type: system
  Action: update
  File: api.md, component.md, design.md, structure.md, product.md, personas.md, tech.md, state.md, log.md
  Description: synchronized planning docs with Stitch refactor—Property optional showcase fields + reference folder path in api; rewrote component inventory (StitchHeader, SiteFooter, sidebar/sheet filters, ShowcaseHero, PropertyShowcaseDetail, PropertyRailNav, MaterialIcon, cn helper); refreshed design/layout/structure; product vision + tech stack (Inter, Material Symbols, Tailwind tokens); personas intro tying to Stitch; state cross-checks and breaking-change caveat for optional DTO additions
  Reason: keep product ↔ design ↔ API ↔ components aligned after UI implementation per user request
  Impact: onboarding, PR narratives, backend contract discussions
  Breaking: NO

---

- [2026-05-12 15:55]
  Type: ux
  Action: update
  File: globals.css, SkipButton.tsx, design.md, component.md, tech.md, structure.md, product.md, log.md
  Description: rebuilt opening **Skip** as liquid glass capsule (gradient translucency, blur+saturate, border, inset specular, diagonal sheen, uppercase tracking); removed `Button` dependency; documented in design/component/tech/product/structure
  Reason: align gate CTA with Stitch “liquid glass” language and improve legibility on video
  Impact: VideoGate UX only
  Breaking: NO

---

- [2026-05-12 15:56]
  Type: fix
  Action: create
  File: src/app/not-found.tsx
  Description: minimal **not-found** page with HOME link so `next build` can prerender `/_not-found` (was failing with ENOENT)
  Reason: restore green production build pipeline
  Impact: routes only hit on invalid URLs
  Breaking: NO

---

- [2026-05-12 17:45]
  Type: ux
  Action: update
  File: StitchHeader.tsx, HomePage.tsx, PropertyFilterSidebar.tsx, FilterPanel.tsx, design.md, component.md, tech.md, state.md, log.md
  Description: replaced header **search** glyph with **`filter_list`** Material icon; **`StitchHeader`** now **`onFilterPress`** + **`filtersExpanded`** (+ optional **`aria-controls`**); **`lg+`** toggles **`PropertyFilterSidebar`** slide-away + **`pl-80`** easing; **`&lt;lg`** toolbar toggles mobile **`FilterPanel`** (was open-only); sidebar **`aria-hidden`** + stable **`desktop-property-filters`** / **`mobile-property-filters`** ids for assistive linkage; **`useLayoutEffect`** breakpoint sync avoids hydration drift on **`aria-expanded`**
  Reason: clearer filter affordance and explicit show/hide of the Chrome filter surfaces
  Impact: browsing chrome; planner docs synced
  Breaking: NO

---

- [2026-09-27 17:15]
  Type: ux
  Action: update
  File: HouseStage.tsx, NeoclassicalVilla.tsx, materials.ts, package.json
  Description: cinematic dusk polish from Lunas/Vision/ProPlan + drei patterns — Sky turbidity dusk, SoftShadows, ACES ToneMapping + Bloom + Vignette, warmer glass emissives, pool depth, soft auto-rotate, ground falloff
  Reason: user asked for prettier model after researching other showcase sites
  Impact: 3D hero visual quality
  Breaking: NO

---

- [2026-09-27 18:10]
  Type: feature
  Action: replace
  File: ModernPoolVilla.tsx, HouseStage.tsx, materials.ts, NeoclassicalVilla.tsx (removed), properties.json
  Description: replaced the neoclassical villa with a white two-storey gable house matching the pool-terrace reference — 13.6×8.6 m, 28° Satteldach, black aluminum sliders, balcony, podium pool, studio daylight
  Reason: user asked to rebuild the home model from the supplied elevation instead of the old version
  Impact: 3D hero model and Aurora listing copy
  Breaking: NO

---
