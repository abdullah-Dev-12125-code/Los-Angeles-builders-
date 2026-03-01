import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, ZoomIn } from "lucide-react";
import { Property } from "@/lib/property-system";

interface PropertyMapIntelligenceProps {
  properties: Property[];
  onLocationSelect?: (location: string) => void;
}

// Mock locations with coordinates (long, lat)
const LOCATION_COORDS: Record<string, [number, number]> = {
  "Beverly Hills, Los Angeles": [-118.4065, 34.0901],
  "Santa Monica, Los Angeles": [-118.4912, 34.0195],
  "Downtown Los Angeles": [-118.2437, 34.0522],
  "Malibu Coast": [-118.6829, 34.2797],
  "West Hollywood": [-118.3719, 34.0901],
  "Culver City": [-118.3881, 34.0066],
  Pasadena: [-118.1445, 34.1478],
  "Manhattan Beach": [-118.4114, 33.8815],
  "Silver Lake": [-118.2688, 34.1078],
  "Studio City": [-118.3849, 34.1292],
};

export default function PropertyMapIntelligence({
  properties,
  onLocationSelect,
}: PropertyMapIntelligenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate location density
  const locationDensity = useMemo(() => {
    const density: Record<string, number> = {};
    properties.forEach((p) => {
      density[p.location] = (density[p.location] || 0) + 1;
    });
    return density;
  }, [properties]);

  // Draw heatmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const mapWidth = width - padding * 2;
    const mapHeight = height - padding * 2;

    // Clear canvas
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * mapWidth) / 5;
      const y = padding + (i * mapHeight) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Find max density for scaling
    const maxDensity = Math.max(
      1,
      ...Object.values(locationDensity)
    );

    // Draw location markers (heatmap)
    Object.entries(LOCATION_COORDS).forEach(([location, [lng, lat]]) => {
      const density = locationDensity[location] || 0;
      const density_ratio = density / maxDensity;

      // Normalize coordinates (simplified LA region bounds)
      const x = padding + ((lng + 118.5) / 0.35) * (mapWidth / 300);
      const y =
        height -
        padding -
        ((lat - 33.8) / 0.5) * (mapHeight / 100);

      // Draw circle with size based on density
      const radius = 8 + density_ratio * 20;
      ctx.fillStyle = `rgba(255, 56, 92, ${0.3 + density_ratio * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw number
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(density), x, y);
    });

    // Draw axes labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("West", padding, height - padding + 25);
    ctx.fillText("East", width - padding, height - padding + 25);
    ctx.textAlign = "right";
    ctx.fillText("South", padding - 10, height - padding);
    ctx.fillText("North", padding - 10, padding);
  }, [locationDensity]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Property Map Intelligence
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Density heatmap of available listings across LA
            </p>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="p-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
        />

        {/* Location List */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(locationDensity)
            .sort(([, a], [, b]) => b - a)
            .map(([location, count]) => (
              <motion.button
                key={location}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLocationSelect?.(location)}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                  {location.split(",")[0]}
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {count} properties
                </p>
              </motion.button>
            ))}
        </div>
      </div>
    </motion.section>
  );
}
