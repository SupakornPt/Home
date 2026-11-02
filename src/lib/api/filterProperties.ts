import type { Property, PropertyFilters } from "@/types/property";

function matchesQuery(property: Property, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
  const haystack = [
    property.title,
    property.addressLine,
    property.city,
    ...property.features,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function filterProperties(
  list: Property[],
  filters: PropertyFilters,
): Property[] {
  return list.filter((property) => {
    if (
      filters.minPrice !== undefined &&
      property.price < filters.minPrice
    ) {
      return false;
    }
    if (
      filters.maxPrice !== undefined &&
      property.price > filters.maxPrice
    ) {
      return false;
    }
    if (filters.minBeds !== undefined && property.beds < filters.minBeds) {
      return false;
    }
    if (filters.city !== undefined && filters.city.length > 0) {
      if (property.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }
    if (filters.query !== undefined && !matchesQuery(property, filters.query)) {
      return false;
    }
    return true;
  });
}
