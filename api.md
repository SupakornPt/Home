# API contract (phase 1)

Typed boundaries for strict TypeScript. Replace base URL via environment variable (e.g. `NEXT_PUBLIC_API_BASE`).

## DTOs (conceptual)

### `Property`

```typescript
// Illustrative — exact names in src/types/property.ts (Zod in src/lib/schemas/property.ts)
interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  beds: number;
  baths: number;
  areaSqm: number;
  addressLine: string;
  city: string;
  features: string[];
  modelUrl: string; // glTF/GLB; empty = built-in primitive in UI
  seller: Seller;
  /** Showcase spec tiles (optional; Stitch-style listing UI). */
  propertyType?: string;
  floors?: number;
  parkingSlots?: number;
  listingDescription?: string;
}
```

### `Seller`

```typescript
interface Seller {
  name: string;
  company?: string;
  email: string;
  phone: string;
}
```

### `PropertyFilters`

```typescript
interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  city?: string;
  query?: string; // optional text search on title/address
}
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/properties?minPrice=&maxPrice=&minBeds=&city=&query=` | Returns `Property[]` matching filters. |
| `GET` | `/properties/:id` | Optional if list is full; else omit. |
| `POST` | `/properties/:id/contact` | Body: `{ name, email, message }`; associates inquiry with listing. |

### Contact request body

```typescript
interface ContactRequest {
  name: string;
  email: string;
  message: string;
}
```

### Contact response

```typescript
interface ContactResponse {
  ok: true;
  referenceId: string;
}
```

Errors: JSON `{ "error": string, "code"?: string }` with appropriate HTTP status.

## Mock / static phase

- Implement `lib/api` with `getProperties` / `submitContact` that swap between **JSON file** (`public/data/properties.json`) and **live fetch** using the same function signatures.

## UX reference export

- **Stitch showcase:** design tokens and HTML reference live under **`stitch_home_3d_interactive_showcase/`** (Google Stitch export). Implemented UI follows that layout at a component level while keeping this `Property` shape as the data contract.

## Cross-checks

- **↔ `state.md`:** Filters and `properties[]` + `currentIndex` align with GET list; contact POST uses active listing `id`.
- **↔ `component.md`:** `PropertyShowcaseDetail`, `ShowcaseHero` / `HouseStage`, sidebar + `FilterPanel`, `ContactForm` consume these DTOs only.
