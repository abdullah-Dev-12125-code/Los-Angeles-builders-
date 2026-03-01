import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, X } from "lucide-react";
import { debounce } from "@/lib/debounce";
import PremiumPriceSlider from "./PremiumPriceSlider";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  locations: string[];
  types: string[];
  rating: number[];
}

interface FilterSidebarProps {
  onFilterChange: (filters: Partial<FilterState>) => void;
  currentFilters: FilterState;
  isOpen?: boolean;
  onClose?: () => void;
  resultCount?: number;
}

const LOCATIONS = [
  "Downtown LA",
  "West Hollywood",
  "Venice Beach",
  "Santa Monica",
  "Malibu",
  "Beverly Hills",
  "Culver City",
  "Studio City",
  "Pasadena",
  "Long Beach",
];

const PROPERTY_TYPES = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Industrial", value: "industrial" },
  { label: "Luxury", value: "luxury" },
];

const RATINGS = [5, 4.5, 4, 3.5];

const FilterSidebar = memo(function FilterSidebar({
  onFilterChange,
  currentFilters,
  isOpen = true,
  onClose,
  resultCount = 0,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    location: true,
    type: true,
    rating: false,
  });

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const debouncedFilterChange = useCallback(
    debounce((filters: Partial<FilterState>) => {
      onFilterChange(filters);
    }, 300),
    [onFilterChange]
  );

  const handleTypeChange = (type: string) => {
    const newTypes = currentFilters.types.includes(type)
      ? currentFilters.types.filter((t) => t !== type)
      : [...currentFilters.types, type];
    debouncedFilterChange({ types: newTypes });
  };

  const handleLocationChange = (location: string) => {
    const newLocations = currentFilters.locations.includes(location)
      ? currentFilters.locations.filter((l) => l !== location)
      : [...currentFilters.locations, location];
    debouncedFilterChange({ locations: newLocations });
  };

  const handleRatingChange = (rating: number) => {
    const newRatings = currentFilters.rating.includes(rating)
      ? currentFilters.rating.filter((r) => r !== rating)
      : [...currentFilters.rating, rating];
    debouncedFilterChange({ rating: newRatings });
  };

  const handlePriceChange = (values: [number, number]) => {
    debouncedFilterChange({ minPrice: values[0], maxPrice: values[1] });
  };

  const handleReset = () => {
    onFilterChange({
      minPrice: 0,
      maxPrice: 10000000,
      locations: [],
      types: [],
      rating: [],
    });
  };

  const activeFilterCount =
    currentFilters.locations.length +
    currentFilters.types.length +
    currentFilters.rating.length +
    (currentFilters.minPrice > 0 || currentFilters.maxPrice < 10000000 ? 1 : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed md:relative w-80 md:w-72 h-screen md:h-auto md:max-h-[calc(100vh-120px)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 md:z-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="ml-auto px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="md:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin pb-5">
              {/* Price Range */}
              <motion.div className="border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => toggleSection("price")}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium text-slate-900 dark:text-white">Price Range</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.price && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4"
                    >
                      <div className="space-y-4">
                        <PremiumPriceSlider
                          minPrice={currentFilters.minPrice}
                          maxPrice={currentFilters.maxPrice}
                          onPriceChange={handlePriceChange}
                        />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                            <p className="text-slate-600 dark:text-slate-400">Min</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              ${currentFilters.minPrice.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                            <p className="text-slate-600 dark:text-slate-400">Max</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              ${currentFilters.maxPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Property Type */}
              <motion.div className="border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => toggleSection("type")}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium text-slate-900 dark:text-white">Property Type</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.type ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.type && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 space-y-2"
                    >
                      {PROPERTY_TYPES.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={currentFilters.types.includes(value)}
                            onChange={() => handleTypeChange(value)}
                            className="w-4 h-4 rounded border-slate-300 text-red-500 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {label}
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Locations */}
              <motion.div className="border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => toggleSection("location")}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium text-slate-900 dark:text-white">Location</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.location ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.location && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 space-y-2 max-h-48 overflow-y-auto scrollbar-thin"
                    >
                      {LOCATIONS.map((location) => (
                        <label key={location} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={currentFilters.locations.includes(location)}
                            onChange={() => handleLocationChange(location)}
                            className="w-4 h-4 rounded border-slate-300 text-red-500 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {location}
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Rating */}
              <motion.div className="border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => toggleSection("rating")}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium text-slate-900 dark:text-white">Rating</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.rating ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.rating && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 space-y-2"
                    >
                      {RATINGS.map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={currentFilters.rating.includes(rating)}
                            onChange={() => handleRatingChange(rating)}
                            className="w-4 h-4 rounded border-slate-300 text-red-500 cursor-pointer"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            ⭐ {rating}+ Stars
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-900 dark:text-white">{resultCount}</span> results found
              </div>
              <button
                onClick={handleReset}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium transition-colors duration-200"
              >
                Reset Filters
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
});

export default FilterSidebar;
