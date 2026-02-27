import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { Property } from "@/lib/property-data";

interface PropertyGridProps {
  properties: Property[];
  favorites: Set<string>;
  onPropertySelect: (property: Property) => void;
  onPropertyContactClick: (property: Property) => void;
  onToggleFavorite: (propertyId: string) => void;
  isLoading?: boolean;
}

export default function PropertyGrid({
  properties,
  favorites,
  onPropertySelect,
  onPropertyContactClick,
  onToggleFavorite,
  isLoading = false,
}: PropertyGridProps) {
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 12;

  // Load initial and paginated properties
  useEffect(() => {
    setIsMounted(true);
    setDisplayedProperties(properties.slice(0, ITEMS_PER_PAGE * page));
  }, [properties, page]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate loading delay
          setTimeout(() => {
            setPage((prev) => prev + 1);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoadingMore]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const skeletonItems = Array.from({ length: 12 });

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {properties.length === 0
              ? "No properties found"
              : `${properties.length} properties available`}
          </h2>
          <p className="text-sm text-gray-600">
            Showing {displayedProperties.length}{" "}
            {displayedProperties.length === 1 ? "result" : "results"}
          </p>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {isLoading && page === 1
          ? skeletonItems.map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 h-96 animate-pulse" />
            ))
          : displayedProperties.map((property) => (
              <motion.div key={property.id} variants={itemVariants}>
                <PropertyCard
                  property={property}
                  onCardClick={onPropertySelect}
                  onContactClick={onPropertyContactClick}
                  isFavorite={favorites.has(property.id)}
                  onFavoriteToggle={() => onToggleFavorite(property.id)}
                />
              </motion.div>
            ))}
      </motion.div>

      {/* Empty state */}
      {!isLoading && properties.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No properties found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results
          </p>
        </motion.div>
      )}

      {/* Infinite scroll trigger */}
      {properties.length > displayedProperties.length && (
        <div ref={observerTarget} className="h-20 flex items-center justify-center py-8">
          {isLoadingMore && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
              className="w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full"
            />
          )}
        </div>
      )}

      {/* No more results */}
      {displayedProperties.length >= properties.length && properties.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-600"
        >
          <p>You've reached the end of available properties</p>
        </motion.div>
      )}
    </div>
  );
}
