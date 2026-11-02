# Product: HOME

## Vision

**HOME** is a single-page property discovery experience: a cinematic full-screen opening video on every visit, then a **gallery-style** interface to browse homes. Visual language merges **Apple-like** pacing with the Google **Stitch** export **HOME · 3D interactive showcase** (glass chrome, sidebar search on desktop, oversized 3D stage, bottom property rail)—see **`stitch_home_3d_interactive_showcase/`** and **`design.md`**.

Each listing centers on an interactive **3D house model** the user can drag to orbit and inspect—not a static image.

## Goals

- Communicate listings with depth (3D) and polish (motion, typography, spacing).
- Let users move quickly between properties via **horizontal swipe** (mobile-first; keyboard/controls on desktop).
- Support **search/filter** to narrow the catalog.
- Surface **standard home details** and a clear path to **contact the property seller**.

## Non-goals (initial scope)

- Audio on the opening video (explicitly off).
- Multi-page marketing site beyond this single-page product shell (no separate blog unless added later).

## User answers (source of truth)

| Topic | Decision |
|--------|-----------|
| 3D | House model; user can **drag to rotate** and see around the model (orbit-style). |
| Opening | **Full screen, every visit**; **Skip** as **liquid glass** capsule (readable on video); **no sound**. |
| Structure | **Single page**; **swipe left** for next property; includes **filters**, **standard detail**, **seller contact**. |
| Interaction | Drag to orbit 3D model (side views via rotation). |
| Brand | Site name **HOME**; visual style **like Apple’s website** (clean, generous whitespace, refined type, subtle motion). |

## Core user flows

1. **Land** → full-screen muted video → user taps **Skip** or video ends → main experience.
2. **Browse** → default or filtered list implied by current property; **swipe left** advances to next property (carousel / deck mental model).
3. **Inspect** → 3D viewport: drag to rotate; optional pinch-zoom on touch if we add it later (product does not require zoom yet).
4. **Refine** → open filters → adjust criteria → results update which properties appear in the swipe sequence.
5. **Act** → view detail blocks (beds, baths, sqm, price, etc.) → **contact seller** (form or mailto/tel per integration).

## Success metrics (suggested)

- Time to first interactive 3D after skip < 3s on mid-tier mobile (network permitting).
- Filter application feels instant (<100ms perceived for local/mock data).
- WCAG-minded contrast and focus states despite “Apple-like” minimal UI.

## Open assumptions

- **Property data** source TBD (CMS, JSON, or API); contracts defined in `api.md` / `state.md`.
- **3D assets** per listing (glTF/GLB) supplied or generated separately; product treats URL + metadata as given.

## Cross-checks

- **↔ `component.md`:** Every flow above maps to named UI regions (video gate, hero 3D, detail, filters, contact, swipe container).
- **↔ `state.md`:** Visit video, index, filters, and loaded listing drive the UI.
