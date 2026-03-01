import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, Filter, Heart, MapPin, DollarSign, Home, TrendingUp, Clock,
  ChevronDown, X, Loader, Star, Eye, Share2, Bell, ArrowRight, ListFilter,
  ChevronLeft, ChevronRight, Grid3x3, List,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  rating: number;
  reviews: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  views: number;
  favorites: number;
  type: 'apartment' | 'villa' | 'studio' | 'house';
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    location: 'Downtown LA',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1545321554-5fefe8c9ef14?w=500&h=400&fit=crop',
    rating: 4.8,
    reviews: 124,
    isFeatured: true,
    isTrending: true,
    views: 1240,
    favorites: 127,
    type: 'apartment',
  },
  {
    id: '2',
    title: 'Luxury Villa with Pool',
    price: 850000,
    location: 'Beverly Hills',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop',
    rating: 4.9,
    reviews: 89,
    isFeatured: true,
    views: 2100,
    favorites: 203,
    type: 'villa',
  },
  {
    id: '3',
    title: 'Cozy Studio Apartment',
    price: 250000,
    location: 'Santa Monica',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    rating: 4.5,
    reviews: 67,
    isNew: true,
    views: 450,
    favorites: 65,
    type: 'studio',
  },
  {
    id: '4',
    title: 'Beach Front House',
    price: 1200000,
    location: 'Malibu',
    bedrooms: 4,
    bathrooms: 3,
    area: 3800,
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400&fit=crop',
    rating: 4.9,
    reviews: 156,
    isTrending: true,
    views: 3400,
    favorites: 456,
    type: 'house',
  },
  {
    id: '5',
    title: 'Modern Office Loft',
    price: 650000,
    location: 'Arts District',
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&h=400&fit=crop',
    rating: 4.6,
    reviews: 98,
    views: 820,
    favorites: 142,
    type: 'apartment',
  },
  {
    id: '6',
    title: 'Cozy Hollywood Hideaway',
    price: 380000,
    location: 'Hollywood',
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
    rating: 4.7,
    reviews: 112,
    isNew: true,
    views: 650,
    favorites: 89,
    type: 'apartment',
  },
];

interface FilterState {
  priceMin: number;
  priceMax: number;
  bedrooms: number | null;
  bathrooms: number | null;
  location: string;
  type: string;
  sortBy: 'newest' | 'priceLow' | 'priceHigh' | 'rating' | 'trending';
}

const BuyerDashboardPro: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    priceMin: 0,
    priceMax: 2000000,
    bedrooms: null,
    bathrooms: null,
    location: '',
    type: '',
    sortBy: 'newest',
  });

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [savedSearches, setSavedSearches] = useState<string[]>(['Modern Apartments', 'Beach Houses']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Debounced search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoized filtering and sorting
  const filteredProperties = useMemo(() => {
    return mockProperties
      .filter((prop) => {
        if (
          prop.price < filters.priceMin ||
          prop.price > filters.priceMax
        )
          return false;
        if (filters.bedrooms && prop.bedrooms !== filters.bedrooms)
          return false;
        if (filters.bathrooms && prop.bathrooms !== filters.bathrooms)
          return false;
        if (filters.location && !prop.location.toLowerCase().includes(filters.location.toLowerCase()))
          return false;
        if (filters.type && prop.type !== filters.type) return false;
        if (debouncedSearch && !prop.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
          return false;
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'priceLow':
            return a.price - b.price;
          case 'priceHigh':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'trending':
            return b.views - a.views;
          default:
            return 0;
        }
      });
  }, [filters, debouncedSearch]);

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handlePriceChange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
    setCurrentPage(1);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardHoverVariants = {
    rest: { y: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    hover: { y: -12, boxShadow: '0 20px 25px rgba(230,57,70,0.2)', transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:from-[#0A0F1A] dark:via-[#1B1F32] dark:to-[#0D1B2A]">
      {/* Clean Airbnb-style Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-[#f7f5f2]/90 dark:bg-[#1B263B] backdrop-blur border-b border-black/5 dark:border-[#2A3F5F] shadow-sm"
      >
        <div className="max-w-[1760px] mx-auto px-6 lg:px-20 py-5">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-amber-600">
                Los Santos Homes
              </h1>
              <nav className="hidden lg:flex items-center gap-8">
                <button className="text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 pb-3 border-b-2 border-transparent hover:border-gray-300 transition-colors">
                  Properties
                </button>
                <button className="text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 pb-3 border-b-2 border-transparent hover:border-gray-300 transition-colors flex items-center gap-1">
                  Experiences
                  <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">NEW</span>
                </button>
                <button className="text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 pb-3 border-b-2 border-transparent hover:border-gray-300 transition-colors">
                  Saved
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="hidden lg:block text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-full transition-colors">
                Become a seller
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-700 dark:text-white" />
              </button>
              <div className="h-8 w-8 bg-gray-800 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">AH</span>
              </div>
            </div>
          </div>

          {/* Large Search Bar - Airbnb Style */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-300 dark:divide-gray-600">
                {/* Where */}
                <div className="px-6 py-3.5 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l-full transition-colors">
                  <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1">Where</label>
                  <input
                    type="text"
                    placeholder="Search locations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                  />
                </div>

                {/* Property Type */}
                <div className="px-6 py-3.5 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer"
                  >
                    <option value="">Any type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="house">House</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="px-6 py-3.5 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1">Budget</label>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    ${(filters.priceMin / 1000).toFixed(0)}K - ${(filters.priceMax / 1000).toFixed(0)}K
                  </div>
                </div>

                {/* Search Button */}
                <div className="px-3 py-2.5 flex items-center justify-center md:justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-amber-500 hover:bg-amber-400 text-white p-3 rounded-full transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span className="text-sm font-semibold hidden lg:inline">Search</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { label: 'All', active: !filters.bedrooms },
              { label: '1 Bed', value: 1 },
              { label: '2 Beds', value: 2 },
              { label: '3 Beds', value: 3 },
              { label: '4+ Beds', value: 4 },
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    bedrooms: filter.value || null,
                  }))
                }
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  (filter.active || filters.bedrooms === filter.value)
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 border border-gray-300 dark:border-gray-600"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1760px] mx-auto px-6 lg:px-20 py-8">
        {/* Featured Properties - Horizontal Scroll (Airbnb Originals style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                Featured Listings ✨
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Handpicked properties from trusted sellers
              </p>
            </div>
            <button className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1 hover:underline">
              Show all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:-mx-20 lg:px-20">
            {mockProperties.slice(0, 6).filter(p => p.isFeatured || p.isTrending).map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-80 group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden mb-3 h-72">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                      ✨ Featured
                    </span>
                  </div>

                  {/* Share & Favorite */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="p-2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 rounded-full transition-colors backdrop-blur-sm">
                      <Share2 className="w-4 h-4 text-gray-700 dark:text-white" />
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(property.id)}
                      className="p-2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 rounded-full transition-colors backdrop-blur-sm"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.has(property.id)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-gray-700 dark:text-white'
                        }`}
                      />
                    </motion.button>
                  </div>

                  {/* Quick View on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Quick view →</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base pr-2">
                      {property.location}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{property.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {property.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {property.bedrooms} bed · {property.bathrooms} bath
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-semibold">${(property.price / 1000).toFixed(0)}K</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">total</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <div className="bg-white dark:bg-[#1B263B] rounded-2xl p-6 border border-black/5 dark:border-[#2A3F5F] sticky top-32">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-600 dark:text-[#A8DADC] hover:text-gray-900 dark:hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price range</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Minimum</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={filters.priceMin}
                              onChange={(e) =>
                                handlePriceChange(
                                  parseInt(e.target.value),
                                  filters.priceMax
                                )
                              }
                              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Maximum</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={filters.priceMax}
                              onChange={(e) =>
                                handlePriceChange(
                                  filters.priceMin,
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000000"
                        step="50000"
                        value={filters.priceMax}
                        onChange={(e) =>
                          handlePriceChange(
                            filters.priceMin,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div className="mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Bathrooms</h3>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              bathrooms: prev.bathrooms === num ? null : num,
                            }))
                          }
                          className={`flex-1 py-3 rounded-lg border font-medium transition-all ${
                            filters.bathrooms === num
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-amber-500'
                          }`}
                        >
                          {num}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Property type</h3>
                    <div className="space-y-3">
                      {[
                        { value: '', label: 'All types' },
                        { value: 'apartment', label: 'Apartment' },
                        { value: 'villa', label: 'Villa' },
                        { value: 'studio', label: 'Studio' },
                        { value: 'house', label: 'House' },
                      ].map((type) => (
                        <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="radio"
                              name="type"
                              value={type.value}
                              checked={filters.type === type.value}
                              onChange={(e) =>
                                setFilters((prev) => ({ ...prev, type: e.target.value }))
                              }
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full peer-checked:border-amber-500 peer-checked:border-[6px] transition-all"></div>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {type.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <button
                    onClick={() => {
                      setFilters({
                        priceMin: 0,
                        priceMax: 2000000,
                        bedrooms: null,
                        bathrooms: null,
                        location: '',
                        type: '',
                        sortBy: 'newest',
                      });
                    }}
                    className="w-full mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-amber-600 hover:text-amber-500 underline hover:no-underline transition-all"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Properties Grid/List */}
          <motion.div
            className="lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {paginatedProperties.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10'
                      : 'space-y-6'
                  }
                >
                  {paginatedProperties.map((property, idx) => (
                    <motion.div
                      key={property.id}
                      variants={itemVariants}
                      transition={{ delay: idx * 0.05 }}
                      className="group cursor-pointer"
                    >
                      {/* Image */}
                      <div className={`relative ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                        <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'w-full'} rounded-2xl overflow-hidden mb-3`}>
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          
                          {/* Badges */}
                          {property.isTrending && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
                                🔥 Trending
                              </span>
                            </div>
                          )}
                          {property.isNew && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
                                New
                              </span>
                            </div>
                          )}

                          {/* Favorite Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(property.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 rounded-full transition-colors backdrop-blur-sm"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                favorites.has(property.id)
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-gray-700 dark:text-white'
                              }`}
                            />
                          </motion.button>
                        </div>

                        {/* Content */}
                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 pr-2">
                              {property.location}
                            </h3>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {property.rating}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                            {property.title}
                          </p>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {property.bedrooms} bed · {property.bathrooms} bath · {property.area} sqft
                          </p>

                          <p className="text-gray-900 dark:text-white">
                            <span className="font-semibold">${(property.price / 1000).toFixed(0)}K</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">total</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </motion.button>

                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 2 + i;
                        }
                        if (pageNum > totalPages) return null;

                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-amber-500 text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </motion.button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-24"
              >
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Home className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No exact matches
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                  Try adjusting your filters or search to find more properties
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      priceMin: 0,
                      priceMax: 2000000,
                      bedrooms: null,
                      bathrooms: null,
                      location: '',
                      type: '',
                      sortBy: 'newest',
                    });
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-400 transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardPro;
