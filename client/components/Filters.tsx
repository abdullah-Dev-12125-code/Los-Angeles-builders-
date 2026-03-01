import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useState, useCallback } from "react";
import { debounce } from "@/lib/debounce";
import PremiumPriceSlider from "./PremiumPriceSlider";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  location: string[];
  type: string[];
  rating: number[];
}

interface FiltersProps {
  onFilterChange: (filters: Partial<FilterState>) => void;
  currentFilters: FilterState;
  isOpen?: boolean;
  onClose?: () => void;
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
  "Silver Lake",
  "Echo Park",
  "Los Feliz",
  "Griffith Park",
  "Mid-City",
];

const PROPERTY_TYPES = ["residential", "commercial", "industrial", "luxury"];
const RATINGS = [5, 4.5, 4, 3.5];

export default function Filters({
  onFilterChange,
  currentFilters,
  isOpen = true,
  onClose,
}: FiltersProps) {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    price: true,
    location: false,
    type: false,
    rating: false,
  });

  const [localMinPrice, setLocalMinPrice] = useState(currentFilters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(currentFilters.maxPrice);
  const [minInput, setMinInput] = useState(currentFilters.minPrice.toLocaleString("en-US"));
  const [maxInput, setMaxInput] = useState(currentFilters.maxPrice.toLocaleString("en-US"));

  const debouncedFilterChange = useCallback(
    debounce((filters: Partial<FilterState>) => {
      onFilterChange(filters);
    }, 300),
    [onFilterChange]
  );

  const handleSliderChange = (values: [number, number]) => {
    setLocalMinPrice(values[0]);
    setLocalMaxPrice(values[1]);
    setMinInput(values[0].toLocaleString("en-US"));
    setMaxInput(values[1].toLocaleString("en-US"));
    debouncedFilterChange({ minPrice: values[0], maxPrice: values[1] });
  };

  const handleMinInput = (value: string) => {
    // Remove commas for parsing
    const cleanValue = value.replace(/,/g, "");
    
    if (cleanValue === "" || /^\d+$/.test(cleanValue)) {
      setMinInput(value);
      if (cleanValue !== "") {
        const numValue = parseInt(cleanValue);
        if (numValue <= localMaxPrice - 100) {
          const newMin = numValue || 0;
          setLocalMinPrice(newMin);
          debouncedFilterChange({ minPrice: newMin });
        }
      }
    }
  };

  const handleMaxInput = (value: string) => {
    // Remove commas for parsing
    const cleanValue = value.replace(/,/g, "");
    
    if (cleanValue === "" || /^\d+$/.test(cleanValue)) {
      setMaxInput(value);
      if (cleanValue !== "") {
        const numValue = parseInt(cleanValue);
        if (numValue >= localMinPrice + 100) {
          const newMax = numValue || 10000;
          setLocalMaxPrice(newMax);
          debouncedFilterChange({ maxPrice: newMax });
        }
      }
    }
  };

  const handleMinBlur = () => {
    const numValue = parseInt(minInput.replace(/,/g, "")) || 0;
    setMinInput(numValue.toLocaleString("en-US"));
  };

  const handleMaxBlur = () => {
    const numValue = parseInt(maxInput.replace(/,/g, "")) || 10000;
    setMaxInput(numValue.toLocaleString("en-US"));
  };

  const toggleLocation = (loc: string) => {
    const newLocations = currentFilters.location.includes(loc)
      ? currentFilters.location.filter((l) => l !== loc)
      : [...currentFilters.location, loc];
    onFilterChange({ location: newLocations });
  };

  const toggleType = (type: string) => {
    const newTypes = currentFilters.type.includes(type)
      ? currentFilters.type.filter((t) => t !== type)
      : [...currentFilters.type, type];
    onFilterChange({ type: newTypes });
  };

  const toggleRating = (rating: number) => {
    const newRatings = currentFilters.rating.includes(rating)
      ? currentFilters.rating.filter((r) => r !== rating)
      : [...currentFilters.rating, rating];
    onFilterChange({ rating: newRatings });
  };

  const handleClearAll = () => {
    setLocalMinPrice(0);
    setLocalMaxPrice(10000);
    setMinInput("0");
    setMaxInput("10,000");
    onFilterChange({
      minPrice: 0,
      maxPrice: 10000,
      location: [],
      type: [],
      rating: [],
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}K`;
    }
    return `$${val}`;
  };

  const activeFilterCount =
    (currentFilters.location.length > 0 ? 1 : 0) +
    (currentFilters.type.length > 0 ? 1 : 0) +
    (currentFilters.rating.length > 0 ? 1 : 0);

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const FilterSection = ({
    title,
    section,
    children,
    badge,
  }: {
    title: string;
    section: string;
    children: React.ReactNode;
    badge?: number;
  }) => (
    <div className="border-b border-yellow-100 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full font-semibold text-gray-900 hover:text-yellow-600 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {badge ? (
            <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          ) : null}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            expandedSections[section] ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      className="w-full lg:w-80 bg-gradient-to-br from-white via-yellow-50/30 to-yellow-100/40 rounded-2xl shadow-lg p-6 space-y-4 lg:sticky lg:top-24 h-fit border border-yellow-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClearAll}
          className="text-xs font-bold text-yellow-700 hover:text-yellow-800 transition-all px-3 py-1.5 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-yellow-200 rounded-lg border border-transparent hover:border-yellow-300 shadow-sm hover:shadow-md"
        >
          Clear All
        </motion.button>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-yellow-50 border-2 border-yellow-200/70 rounded-xl p-3 space-y-2 shadow-sm"
        >
          <p className="text-xs font-bold text-yellow-900 uppercase tracking-wide">Active Filters</p>
          <div className="flex flex-wrap gap-2">
            {currentFilters.location.map((loc) => (
              <motion.button
                key={loc}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleLocation(loc)}
                className="bg-white border-2 border-yellow-300 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-yellow-50 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
              >
                {loc.split(" ")[0]}
                <X className="w-3 h-3" />
              </motion.button>
            ))}
            {currentFilters.type.map((type) => (
              <motion.button
                key={type}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleType(type)}
                className="bg-white border-2 border-yellow-300 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-yellow-50 transition-all flex items-center gap-1.5 capitalize shadow-sm hover:shadow-md"
              >
                {type}
                <X className="w-3 h-3" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <FilterSection title="Price Range" section="price">
        <div className="space-y-6">
          {/* Premium Slider */}
          <PremiumPriceSlider
            min={0}
            max={10000}
            value={[localMinPrice, localMaxPrice]}
            onChange={handleSliderChange}
            step={50}
          />

          {/* Custom Price Inputs with Enhanced Styling */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <label className="text-xs text-gray-600 font-semibold mb-1.5 block">
                Minimum
              </label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium group-focus-within:text-yellow-600 transition-colors">
                  $
                </span>
                <input
                  type="text"
                  value={minInput}
                  onChange={(e) => handleMinInput(e.target.value)}
                  onBlur={handleMinBlur}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2.5 border-2 border-yellow-200 rounded-xl text-sm font-medium focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 hover:border-yellow-300"
                />
              </div>
            </motion.div>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <label className="text-xs text-gray-600 font-semibold mb-1.5 block">
                Maximum
              </label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium group-focus-within:text-yellow-600 transition-colors">
                  $
                </span>
                <input
                  type="text"
                  value={maxInput}
                  onChange={(e) => handleMaxInput(e.target.value)}
                  onBlur={handleMaxBlur}
                  placeholder="10,000"
                  className="w-full pl-7 pr-3 py-2.5 border-2 border-yellow-200 rounded-xl text-sm font-medium focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 hover:border-yellow-300"
                />
              </div>
            </motion.div>
          </div>

          {/* Selected Range Display with Animation */}
          <motion.div
            initial={false}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3 }}
            key={`${localMinPrice}-${localMaxPrice}`}
            className="bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200/50 shadow-sm"
          >
            <p className="text-sm font-bold text-yellow-900 text-center">
              {formatCurrency(localMinPrice)} - {formatCurrency(localMaxPrice)}
            </p>
          </motion.div>
        </div>
      </FilterSection>

      <FilterSection
        title="Location"
        section="location"
        badge={currentFilters.location.length > 0 ? currentFilters.location.length : undefined}
      >
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {LOCATIONS.map((loc) => (
            <motion.label
              key={loc}
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={currentFilters.location.includes(loc)}
                onChange={() => toggleLocation(loc)}
                className="w-4 h-4 rounded border-yellow-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {loc}
              </span>
            </motion.label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Property Type"
        section="type"
        badge={currentFilters.type.length > 0 ? currentFilters.type.length : undefined}
      >
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <motion.label
              key={type}
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={currentFilters.type.includes(type)}
                onChange={() => toggleType(type)}
                className="w-4 h-4 rounded border-yellow-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize">
                {type}
              </span>
            </motion.label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Minimum Rating"
        section="rating"
        badge={currentFilters.rating.length > 0 ? currentFilters.rating.length : undefined}
      >
        <div className="space-y-2">
          {RATINGS.map((rating) => (
            <motion.label
              key={rating}
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={currentFilters.rating.includes(rating)}
                onChange={() => toggleRating(rating)}
                className="w-4 h-4 rounded border-yellow-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {rating}+ ⭐
              </span>
            </motion.label>
          ))}
        </div>
      </FilterSection>
    </motion.div>
  );
}
