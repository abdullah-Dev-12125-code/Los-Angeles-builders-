import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Search, Filter, LayoutGrid, Map as MapIcon, Plus } from "lucide-react";
import { Property, generateProperties, filterProperties } from "@/lib/property-data";
import PropertyGrid from "@/components/PropertyGrid";
import Filters from "@/components/Filters";
import PropertyModal from "@/components/PropertyModal";
import ContactModal from "@/components/ContactModal";
import RequirementModal from "@/components/RequirementModal";
import ProfileDropdown from "@/components/ProfileDropdown";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  location: string[];
  type: string[];
  rating: number[];
}

export default function UserDashboard() {
  const [allProperties] = useState<Property[]>(() => generateProperties(120));
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [contactProperty, setContactProperty] = useState<Property | null>(null);
  const [showRequirement, setShowRequirement] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 10000,
    location: [],
    type: [],
    rating: [],
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);

  const filteredProperties = useMemo(
    () =>
      filterProperties(allProperties, {
        ...filters,
        searchQuery,
      }),
    [allProperties, filters, searchQuery]
  );

  // Initialize displayed properties
  useEffect(() => {
    setDisplayedProperties(allProperties);
  }, [allProperties]);

  // Update displayed properties with debounce
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setDisplayedProperties(filteredProperties);
      setIsFiltering(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [filteredProperties]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleAddFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/20"
    >
        {/* Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                  Explore Premium Properties
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {displayedProperties.length} properties {isFiltering && "(updating...)"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRequirement(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span className="hidden sm:inline">Post Requirement</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFavorites(new Set())}
                  className="relative px-4 py-2 text-gray-700 hover:text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {favorites.size}
                  </span>
                </motion.button>
                <ProfileDropdown
                  userName="John Anderson"
                  userEmail="john.anderson@example.com"
                />
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, location, or property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-amber-50/20 transition-all"
                />
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-amber-600 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    viewMode === "map"
                      ? "bg-white text-amber-600 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all flex items-center gap-2 font-medium relative"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
                {Object.values(filters).some((v) =>
                  Array.isArray(v)
                    ? v.length > 0
                    : v !== 0 && v !== 10000
                ) && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    ✓
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={itemVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hidden lg:block"
            >
              <Filters
                onFilterChange={handleFilterChange}
                currentFilters={filters}
              />
            </motion.div>
          )}

          {/* Properties Grid */}
          <div className="flex-1 min-h-screen relative">
            {isFiltering && (
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-amber-100/80 to-transparent py-2 px-4 rounded-t-xl">
                <p className="text-xs font-semibold text-amber-900 animate-pulse">
                  Updating results...
                </p>
              </div>
            )}
            {viewMode === "grid" ? (
              <PropertyGrid
                properties={displayedProperties}
                favorites={favorites}
                onPropertySelect={setSelectedProperty}
                onPropertyContactClick={setContactProperty}
                onToggleFavorite={handleAddFavorite}
                isLoading={false}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center border-2 border-blue-200"
              >
                <div className="text-center">
                  <MapIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">
                    Map View Coming Soon
                  </h3>
                  <p className="text-blue-700">
                    Visualize properties on an interactive map
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.main>

      {/* Modals */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onContactClick={(property) => {
            setContactProperty(property);
            setSelectedProperty(null);
          }}
          isFavorited={favorites.has(selectedProperty.id)}
          onToggleFavorite={() => handleAddFavorite(selectedProperty.id)}
        />
      )}

      <ContactModal
        property={contactProperty}
        isOpen={!!contactProperty}
        onClose={() => setContactProperty(null)}
      />

      <RequirementModal
        isOpen={showRequirement}
        onClose={() => setShowRequirement(false)}
      />
    </motion.div>
  );
}
