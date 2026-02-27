import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star, MapPin, Phone, Mail, Heart } from "lucide-react";
import { Property } from "@/lib/property-data";

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onContactClick?: (property: Property) => void;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export default function PropertyModal({
  property,
  isOpen,
  onClose,
  onContactClick,
  isFavorited = false,
  onToggleFavorite,
}: PropertyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsFavorite(isFavorited);
  }, [property, isFavorited]);

  if (!property) return null;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
          >
            {/* Header with Close Button */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-100 bg-white/95 backdrop-blur">
              <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 lg:p-8">
              {/* Gallery Section */}
              <div className="lg:col-span-2 space-y-4">
                {/* Main Image */}
                <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-2xl overflow-hidden">
                  <motion.img
                    key={currentImageIndex}
                    src={property.images[currentImageIndex]}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {property.images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {property.images.map((img, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? "border-amber-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Bedrooms", value: property.beds },
                    { label: "Bathrooms", value: property.baths },
                    { label: "Square Feet", value: `${property.sqft.toLocaleString()}` },
                    { label: "Type", value: property.type.charAt(0).toUpperCase() + property.type.slice(1) },
                  ].map((detail) => (
                    <div key={detail.label} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">{detail.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                {/* Price */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200"
                >
                  <p className="text-sm text-amber-700 mb-2">Starting Price</p>
                  <p className="text-4xl font-bold text-amber-600">
                    ${(property.price / 1000).toFixed(0)}k
                  </p>
                </motion.div>

                {/* Rating */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-3">Rating</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(property.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {property.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {property.reviews} reviews
                  </p>
                </div>

                {/* Location */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </p>
                  <p className="font-semibold text-gray-900">{property.location}</p>
                </div>

                {/* Seller Info */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-3">Seller</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={property.sellerImage}
                      alt={property.seller}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {property.seller}
                      </p>
                      <p className="text-xs text-gray-600">Trusted Seller</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onContactClick?.(property)}
                    className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                  >
                    Contact Seller
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsFavorite(!isFavorite);
                      onToggleFavorite?.();
                    }}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                      isFavorite
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Saved" : "Save Property"}
                  </motion.button>
                </div>

                {/* Tags */}
                {property.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {property.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tag === "Hot"
                            ? "bg-red-100 text-red-700"
                            : tag === "Trending"
                              ? "bg-orange-100 text-orange-700"
                              : tag === "New"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
