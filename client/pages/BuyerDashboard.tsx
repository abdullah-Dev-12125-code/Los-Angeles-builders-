import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, Filter, Search, Settings, X } from "lucide-react";
import { useUserContext } from "@/lib/user-context";
import { getProperties, Property } from "@/lib/property-system";
import { usePropertyFilters } from "@/hooks/use-filters";
import FilterSidebar from "@/components/FilterSidebar";
import PropertyGridSystem from "@/components/PropertyGridSystem";
import PremiumBuyerHeader from "@/components/PremiumBuyerHeader";
import PropertyMapIntelligence from "@/components/PropertyMapIntelligence";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { userProfile } = useUserContext();
  const filters = usePropertyFilters();

  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"discover" | "activity" | "preferences" | "notifications">("discover");
  const [properties] = useState<Property[]>(() => getProperties().filter((property) => property.status === "active"));

  // Filtered properties based on all filter criteria
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (property.price < filters.priceFilter.debouncedMinPrice || property.price > filters.priceFilter.debouncedMaxPrice) {
        return false;
      }

      if (filters.typeFilter.debouncedTypes.length > 0 && !filters.typeFilter.debouncedTypes.includes(property.type)) {
        return false;
      }

      if (
        filters.locationFilter.debouncedLocations.length > 0 &&
        !filters.locationFilter.debouncedLocations.some((loc) => property.location.toLowerCase().includes(loc.toLowerCase()))
      ) {
        return false;
      }

      const query = filters.searchFilter.debouncedSearchTerm.toLowerCase();
      if (query && !property.title.toLowerCase().includes(query) && !property.location.toLowerCase().includes(query)) {
        return false;
      }

      return true;
    });
  }, [
    properties,
    filters.priceFilter.debouncedMinPrice,
    filters.priceFilter.debouncedMaxPrice,
    filters.typeFilter.debouncedTypes,
    filters.locationFilter.debouncedLocations,
    filters.searchFilter.debouncedSearchTerm,
  ]);

  // Hot properties (most viewed)
  const hotProperties = useMemo(
    () => [...properties].sort((a, b) => b.views - a.views).slice(0, 8),
    [properties]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }, []);

  const handleFilterChange = useCallback((newFilters: any) => {
    if (newFilters.minPrice !== undefined) filters.priceFilter.setMinPrice(newFilters.minPrice);
    if (newFilters.maxPrice !== undefined) filters.priceFilter.setMaxPrice(newFilters.maxPrice);
    if (newFilters.types !== undefined) {
      // Update selected types
      const currentTypes = new Set(filters.typeFilter.types);
      newFilters.types.forEach((t: string) => {
        if (!currentTypes.has(t)) filters.typeFilter.toggleType(t);
      });
      currentTypes.forEach((t) => {
        if (!newFilters.types.includes(t)) filters.typeFilter.toggleType(t);
      });
    }
    if (newFilters.locations !== undefined) {
      // Update selected locations
      const currentLocations = new Set(filters.locationFilter.locations);
      newFilters.locations.forEach((loc: string) => {
        if (!currentLocations.has(loc)) filters.locationFilter.toggleLocation(loc);
      });
      currentLocations.forEach((loc) => {
        if (!newFilters.locations.includes(loc)) filters.locationFilter.toggleLocation(loc);
      });
    }
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl lg:max-w-screen-2xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Buyer Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome back, {userProfile.name}. Find your next investment-ready property.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={() => navigate("/user-settings")}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-600" />
              <input
                value={filters.searchFilter.searchTerm}
                onChange={(e) => filters.searchFilter.setSearchTerm(e.target.value)}
                placeholder="Search by title or location..."
                className="bg-transparent text-sm w-full outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>
            <button
              onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
              className="md:hidden px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex relative">
        {/* Filter Sidebar */}
        <div className="hidden md:block md:w-72 lg:w-80 sticky top-20 h-[calc(100vh-80px)] border-r border-slate-200 dark:border-slate-800 overflow-y-auto scrollbar-thin">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            currentFilters={{
              minPrice: filters.priceFilter.minPrice,
              maxPrice: filters.priceFilter.maxPrice,
              locations: filters.locationFilter.locations,
              types: filters.typeFilter.types,
              rating: [],
            }}
            isOpen={true}
            resultCount={filteredProperties.length}
          />
        </div>

        {/* Mobile Filter Sidebar */}
        <div className="md:hidden">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            currentFilters={{
              minPrice: filters.priceFilter.minPrice,
              maxPrice: filters.priceFilter.maxPrice,
              locations: filters.locationFilter.locations,
              types: filters.typeFilter.types,
              rating: [],
            }}
            isOpen={filterSidebarOpen}
            onClose={() => setFilterSidebarOpen(false)}
            resultCount={filteredProperties.length}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-6 py-8 max-w-7xl lg:max-w-screen-2xl mx-auto w-full">
          {activeTab === "discover" && (
            <>
              {/* Premium Header */}
              <PremiumBuyerHeader
                savedCount={favorites.size}
                recentInquiries={properties.reduce((sum, p) => sum + p.inquiries, 0)}
              />

              {/* Map Intelligence */}
              <PropertyMapIntelligence
                properties={filteredProperties}
                onLocationSelect={(location) => {
                  filters.locationFilter.clearLocations();
                  filters.locationFilter.toggleLocation(location);
                }}
              />

              {/* What's Hot Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">What's Hot Now 🔥</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Most viewed properties this week</p>
                  </div>
                </div>
                <PropertyGridSystem properties={hotProperties} favorites={favorites} onToggleFavorite={toggleFavorite} />
              </motion.section>

              {/* All Properties Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Available Properties</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
                    </p>
                  </div>
                </div>
                {filteredProperties.length > 0 ? (
                  <PropertyGridSystem properties={filteredProperties} favorites={favorites} onToggleFavorite={toggleFavorite} />
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400">No properties match your filters. Try adjusting your search.</p>
                  </div>
                )}
              </motion.section>
            </>
          )}

          {activeTab === "activity" && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Inquiries</h3>
              <div className="space-y-2">
                {properties.slice(0, 8).map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{property.title}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap ml-4">{property.inquiries} inquiries</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === "preferences" && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Saved Properties ({favorites.size})</h3>
              {favorites.size > 0 ? (
                <PropertyGridSystem
                  properties={properties.filter((property) => favorites.has(property.id))}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              ) : (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
                  <p className="text-slate-600 dark:text-slate-400">No saved properties yet. Add some favorites to get started!</p>
                </div>
              )}
            </motion.section>
          )}

          {activeTab === "notifications" && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Notifications</h3>
              <div className="space-y-3">
                {[
                  "5 new luxury listings in Beverly Hills.",
                  "2 saved properties had price adjustments.",
                  "Market demand in Santa Monica increased by 12% this week.",
                  "New property matching your preferences!",
                  "3 inquiries received on your favorite properties.",
                ].map((notif, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-red-500">📢</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{notif}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </main>
      </div>

      {/* Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:static border-t md:border-t-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4">
        <div className="max-w-7xl lg:max-w-screen-2xl mx-auto flex gap-2 overflow-x-auto scrollbar-thin py-3 md:hidden">
          {[
            ["discover", "Discover"],
            ["activity", "Activity"],
            ["preferences", "Saved"],
            ["notifications", "Notifications"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id
                  ? "bg-red-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex max-w-7xl lg:max-w-screen-2xl mx-auto gap-2 border-t border-slate-200 dark:border-slate-800">
          {[
            ["discover", "Discover"],
            ["activity", "Activity"],
            ["preferences", "Saved"],
            ["notifications", "Notifications"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === id
                  ? "text-red-500 border-red-500"
                  : "text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
