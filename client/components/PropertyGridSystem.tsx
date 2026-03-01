import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, BedDouble, Bath, Maximize2 } from "lucide-react";
import { Property } from "@/lib/property-system";

interface PropertyGridSystemProps {
  properties: Property[];
  onToggleFavorite?: (id: string) => void;
  favorites?: Set<string>;
}

const PropertyCard = memo(
  ({ property, isFavorite, onToggleFavorite }: { property: Property; isFavorite: boolean; onToggleFavorite?: (id: string) => void }) => {
    return (
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative">
          <img src={property.featuredImage} alt={property.title} loading="lazy" className="h-52 w-full object-cover" />
          <button
            onClick={() => onToggleFavorite?.(property.id)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full text-xs font-semibold ${isFavorite ? "bg-rose-600 text-white" : "bg-white/90 text-slate-700"}`}
          >
            ♥
          </button>
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wide px-2 py-1 rounded bg-slate-900/80 text-white">{property.status}</span>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium line-clamp-1">{property.title}</h3>
            <span className="text-sm font-semibold">${property.price.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-500 inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{property.location}</p>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{property.bedrooms || 0}</span>
            <span className="inline-flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.bathrooms}</span>
            <span className="inline-flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{property.area} sqft</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" />{property.rating} ({property.reviews})</span>
            <span>{property.views.toLocaleString()} views</span>
          </div>
        </div>
      </motion.article>
    );
  },
);

PropertyCard.displayName = "PropertyCard";

export default function PropertyGridSystem({ properties, favorites = new Set<string>(), onToggleFavorite }: PropertyGridSystemProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.04 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 gap-5"
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.has(property.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </motion.div>
  );
}
