import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, Star, MapPin, MessageCircle } from "lucide-react";
import { Property } from "@/lib/property-data";

interface PropertyCardProps {
  property: Property;
  onCardClick: (property: Property) => void;
  onContactClick?: (property: Property) => void;
  isFavorite: boolean;
  onFavoriteToggle: (propertyId: string) => void;
}

const PropertyCard = memo(function PropertyCard({
  property,
  onCardClick,
  onContactClick,
  isFavorite,
  onFavoriteToggle,
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setIsImageLoading(true);
  }, [currentImageIndex]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(property.id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => onCardClick(property)}
      className="group cursor-pointer"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 bg-gray-200 overflow-hidden">
          {/* Skeleton loader */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
          )}

          {/* Image with lazy loading */}
          <img
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
            onLoad={() => setIsImageLoading(false)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tags with Glow Effect */}
          {property.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {property.tags.slice(0, 2).map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm relative ${
                    tag === "Hot"
                      ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50"
                      : tag === "Trending"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50"
                        : tag === "New"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50"
                          : "bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/50"
                  }`}
                >
                  {tag === "Hot" ? "🔥 " : ""}
                  {tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md transition-all"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </motion.button>

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {property.images.map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0.5 }}
                    animate={{
                      opacity: idx === currentImageIndex ? 1 : 0.5,
                      scale: idx === currentImageIndex ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title & Location */}
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {property.description}
          </p>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 border-t border-gray-100 pt-2">
            <div>
              <div className="font-semibold text-gray-900">{property.beds}</div>
              <div>Beds</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {property.baths}
              </div>
              <div>Baths</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {(property.sqft / 1000).toFixed(1)}k
              </div>
              <div>Sqft</div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(property.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-900">
                {property.rating}
              </span>
              <span className="text-xs text-gray-600">
                ({property.reviews})
              </span>
            </div>
          </div>

          {/* Price & Seller */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2">
            <div>
              <div className="text-sm font-bold text-amber-600">
                ${(property.price / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-600">Starting price</div>
            </div>
            <div className="flex items-center gap-1">
              <img
                src={property.sellerImage}
                alt={property.seller}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-xs text-gray-600 line-clamp-1">
                {property.seller}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default PropertyCard;
