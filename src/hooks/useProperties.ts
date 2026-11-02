"use client";

import { useCallback, useEffect, useState } from "react";
import { getProperties } from "@/lib/api/properties";
import type { Property, PropertyFilters } from "@/types/property";

const INITIAL_FILTERS: PropertyFilters = {};

export function useProperties() {
  const [filters, setFilters] = useState<PropertyFilters>(INITIAL_FILTERS);
  const [pendingFilters, setPendingFilters] =
    useState<PropertyFilters>(INITIAL_FILTERS);
  const [properties, setProperties] = useState<Property[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadStatus, setLoadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const load = useCallback(async (f: PropertyFilters) => {
    setLoadStatus("loading");
    setLoadError(null);
    try {
      const list = await getProperties(f);
      setProperties(list);
      setLoadStatus("success");
      setCurrentIndex(0);
    } catch (e) {
      setLoadStatus("error");
      setLoadError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  useEffect(() => {
    void getProperties({})
      .then((list) => {
        const cities = [...new Set(list.map((p) => p.city))].sort();
        setCityOptions(cities);
      })
      .catch(() => {
        setCityOptions([]);
      });
  }, []);

  const commitFilters = useCallback(() => {
    setFilters(pendingFilters);
  }, [pendingFilters]);

  const clearFilters = useCallback(() => {
    setPendingFilters(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
  }, []);

  const setPendingFilterField = useCallback(
    <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
      setPendingFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const hasNext = currentIndex < properties.length - 1;
  const hasPrev = currentIndex > 0;

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(properties.length - 1, i + 1));
  }, [properties.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const currentProperty = properties[currentIndex] ?? null;

  return {
    properties,
    cityOptions,
    filters,
    pendingFilters,
    setPendingFilterField,
    commitFilters,
    clearFilters,
    loadStatus,
    loadError,
    currentIndex,
    setCurrentIndex,
    goNext,
    goPrev,
    hasNext,
    hasPrev,
    currentProperty,
  };
}
