import { PROPERTIES_DATA_PATH } from "@/lib/constants";
import type { Property, PropertyFilters } from "@/types/property";
import { filterProperties } from "@/lib/api/filterProperties";
import { propertiesArraySchema } from "@/lib/schemas/property";

const base =
  typeof process.env.NEXT_PUBLIC_API_BASE === "string"
    ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "")
    : "";

export async function getProperties(
  filters: PropertyFilters,
): Promise<Property[]> {
  if (base.length > 0) {
    const params = new URLSearchParams();
    if (filters.minPrice !== undefined) {
      params.set("minPrice", String(filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      params.set("maxPrice", String(filters.maxPrice));
    }
    if (filters.minBeds !== undefined) {
      params.set("minBeds", String(filters.minBeds));
    }
    if (filters.city !== undefined && filters.city.length > 0) {
      params.set("city", filters.city);
    }
    if (filters.query !== undefined && filters.query.length > 0) {
      params.set("query", filters.query);
    }
    const url = `${base}/properties?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load properties: ${res.status}`);
    }
    const data: unknown = await res.json();
    return propertiesArraySchema.parse(data);
  }

  const res = await fetch(PROPERTIES_DATA_PATH);
  if (!res.ok) {
    throw new Error(`Failed to load mock properties: ${res.status}`);
  }
  const data: unknown = await res.json();
  const all = propertiesArraySchema.parse(data);
  return filterProperties(all, filters);
}
