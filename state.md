# State model

Single-page **HOME**: minimal global state, explicit transitions between **opening gate** and **main browsing**.

## State slices

### 1. Opening gate

| Field | Type | Description |
|-------|------|-------------|
| `gatePhase` | `'video' \| 'main'` | Starts `'video'` every full visit load (per product: every visit). |
| `videoAutoplayBlocked` | `boolean` | UI hint to tap to play if needed. |

**Transitions**

- `skip` → `gatePhase = 'main'`
- `videoEnded` → `gatePhase = 'main'`

No persistence of “skip video forever” in v1 (product: every visit).

### 2. Catalog & navigation

| Field | Type | Description |
|-------|------|-------------|
| `properties` | `Property[]` | From API; replaces when filters change. |
| `currentIndex` | `number` | 0 … `properties.length - 1`. |
| `filters` | `PropertyFilters` | Drives GET query. |
| `loadStatus` | `'idle' \| 'loading' \| 'success' \| 'error'` | List fetch. |
| `loadError` | `string \| null` | User-facing message. |

**Transitions**

- `swipeNext` / `goNext` → `currentIndex = min(length-1, index+1)` (wrap policy: product says “next property”—choose **clamp** or **wrap** at implementation; default **clamp** with disabled control at end).
- `swipePrev` / `goPrev` → decrement with clamp at 0.
- `applyFilters` → reset `currentIndex` to 0, refetch list.

### 3. 3D viewport (local)

| Field | Type | Description |
|-------|------|-------------|
| `modelStatus` | `'idle' \| 'loading' \| 'ready' \| 'error'` | Per active property. |

Orbit rotation is **internal to Three.js / OrbitControls**—not duplicated in React state unless needed for analytics.

### 4. Filter panel chrome (`HomePage`)

| Field | Type | Description |
|-------|------|-------------|
| `desktopFiltersOpen` | `boolean` | **`lg+`:** collapsible filter rail visibility and main content left inset; toolbar toggles. |
| `mobileFiltersOpen` | `boolean` | **`<lg`:** filter bottom sheet visibility; toolbar toggles. |

### 5. Contact form (local)

| Field | Type | Description |
|-------|------|-------------|
| `submitStatus` | `'idle' \| 'submitting' \| 'success' \| 'error'` | |
| `referenceId` | `string \| null` | From API on success. |

## Derived values

- `currentProperty = properties[currentIndex] ?? null`
- `hasNext = currentIndex < properties.length - 1`
- `hasPrev = currentIndex > 0`

## Where state lives (implementation hint)

- **React `useReducer` + context** or **Zustand** for small global slice (gate + catalog + index + filters).
- **React Hook Form** + local state for contact fields (or controlled + Zod).

## Cross-checks

- **↔ `api.md`:** `filters` map to query params; `properties` from GET; contact POST uses `currentProperty.id`.
- **↔ `component.md`:** `VideoGate`, `PropertySwipeDeck` + `ShowcaseHero`, **`PropertyFilterSidebar` / `FilterPanel`** (with **`StitchHeader` toggle wiring**), `HouseStage`, `PropertyShowcaseDetail`, **`PropertyRailNav`**, `ContactForm` bind to slices above.
- **↔ `personas.md`:** Skip + swipe + accessible next/prev covered by `gatePhase` and navigation.

## Breaking-change note

Changing **required** `Property` fields or filter query keys is **Breaking: YES** for API clients and any persisted bookmarks to filtered URLs (if added later). **Optional** showcase fields (`propertyType`, `floors`, `parkingSlots`, `listingDescription`) were added for Stitch UI—they default safely when omitted (`Breaking: NO` for omission-only clients).
