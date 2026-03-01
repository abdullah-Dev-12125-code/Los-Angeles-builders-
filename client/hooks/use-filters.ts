import { useState, useCallback, useEffect } from "react";
import { debounce as debounceUtil } from "@/lib/performance";

/**
 * Hook for managing price filter with debouncing
 */
export function usePriceFilter(initialMin = 500, initialMax = 10000) {
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(initialMin);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(initialMax);

  const debouncedUpdate = useCallback(
    debounceUtil(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 300),
    [minPrice, maxPrice]
  );

  useEffect(() => {
    debouncedUpdate();
  }, [minPrice, maxPrice, debouncedUpdate]);

  return {
    minPrice,
    maxPrice,
    debouncedMinPrice,
    debouncedMaxPrice,
    setMinPrice,
    setMaxPrice,
  };
}

/**
 * Hook for managing property type filter with debouncing
 */
export function usePropertyTypeFilter() {
  const [types, setTypes] = useState<string[]>([]);
  const [debouncedTypes, setDebouncedTypes] = useState<string[]>([]);

  const debouncedUpdate = useCallback(
    debounceUtil(() => {
      setDebouncedTypes(types);
    }, 300),
    [types]
  );

  useEffect(() => {
    debouncedUpdate();
  }, [types, debouncedUpdate]);

  const toggleType = (type: string) => {
    setTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  return {
    types,
    debouncedTypes,
    toggleType,
    clearTypes: () => setTypes([]),
  };
}

/**
 * Hook for managing search filter with debouncing
 */
export function useSearchFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedUpdate = useCallback(
    debounceUtil(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500),
    [searchTerm]
  );

  useEffect(() => {
    debouncedUpdate();
  }, [searchTerm, debouncedUpdate]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  };
}

/**
 * Hook for managing location filter with debouncing
 */
export function useLocationFilter() {
  const [locations, setLocations] = useState<string[]>([]);
  const [debouncedLocations, setDebouncedLocations] = useState<string[]>([]);

  const debouncedUpdate = useCallback(
    debounceUtil(() => {
      setDebouncedLocations(locations);
    }, 300),
    [locations]
  );

  useEffect(() => {
    debouncedUpdate();
  }, [locations, debouncedUpdate]);

  const toggleLocation = (location: string) => {
    setLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  return {
    locations,
    debouncedLocations,
    toggleLocation,
    clearLocations: () => setLocations([]),
  };
}

/**
 * Compound hook for all filters
 */
export function usePropertyFilters() {
  const priceFilter = usePriceFilter();
  const typeFilter = usePropertyTypeFilter();
  const searchFilter = useSearchFilter();
  const locationFilter = useLocationFilter();

  const resetAllFilters = () => {
    priceFilter.setMinPrice(500);
    priceFilter.setMaxPrice(10000);
    typeFilter.clearTypes();
    searchFilter.setSearchTerm("");
    locationFilter.clearLocations();
  };

  return {
    priceFilter,
    typeFilter,
    searchFilter,
    locationFilter,
    resetAllFilters,
  };
}
