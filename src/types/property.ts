export interface Seller {
  name: string;
  company?: string;
  email: string;
  phone: string;
}

export interface Property {
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
  /** glTF/GLB URL or empty to use built-in primitive house */
  modelUrl: string;
  seller: Seller;
  /** Showcase spec tiles (optional; Stitch-style detail row) */
  propertyType?: string;
  floors?: number;
  parkingSlots?: number;
  /** Long-form copy under “Architectural description” */
  listingDescription?: string;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  city?: string;
  query?: string;
}
