import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Building2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  BedDouble,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { getProperties, Property } from "@/lib/property-system";

export default function PropertyCommandCenter() {
  const properties = useMemo(() => getProperties(), []);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  // Mock building data
  const buildingStats = useMemo(() => {
    const total = properties.length;
    const occupied = Math.floor(total * 0.65);
    const forRent = Math.floor(total * 0.2);
    const forSale = Math.floor(total * 0.1);
    const maintenance = total - occupied - forRent - forSale;

    return {
      total,
      occupied,
      forRent,
      forSale,
      maintenance,
      occupancyRate: ((occupied / total) * 100).toFixed(1),
      monthlyRevenue: properties.reduce((sum, p) => sum + p.revenue, 0),
      avgPrice: Math.round(properties.reduce((sum, p) => sum + p.price, 0) / total),
    };
  }, [properties]);

  const unitStatusColors = {
    occupied: "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700",
    "for-rent": "bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700",
    "for-sale": "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700",
    maintenance: "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700",
  };

  const unitStatusIcons = {
    occupied: CheckCircle2,
    "for-rent": Clock,
    "for-sale": TrendingUp,
    maintenance: AlertCircle,
  };

  // Generate mock unit statuses
  const unitStatuses = useMemo(() => {
    const statuses = ["occupied", "for-rent", "for-sale", "maintenance"];
    return properties.slice(0, 20).map((p, i) => ({
      id: p.id,
      unit: `Unit ${i + 1}`,
      status: statuses[i % statuses.length] as keyof typeof unitStatusColors,
      tenant: ["John Smith", "Emma Wilson", "Michael Brown", "Sarah Johnson"][i % 4],
      price: p.price,
    }));
  }, [properties]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 backdrop-blur bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <Building2 className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Property Command Center
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage entire buildings and portfolios efficiently
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Overview Metrics */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
        >
          {[
            {
              icon: Home,
              label: "Total Units",
              value: buildingStats.total,
              color: "blue",
            },
            {
              icon: CheckCircle2,
              label: "Occupied",
              value: buildingStats.occupied,
              color: "emerald",
            },
            {
              icon: Clock,
              label: "For Rent",
              value: buildingStats.forRent,
              color: "amber",
            },
            {
              icon: TrendingUp,
              label: "For Sale",
              value: buildingStats.forSale,
              color: "blue",
            },
            {
              icon: AlertCircle,
              label: "Maintenance",
              value: buildingStats.maintenance,
              color: "red",
            },
            {
              icon: DollarSign,
              label: "Monthly Revenue",
              value: `$${(buildingStats.monthlyRevenue / 1000).toFixed(0)}K`,
              color: "purple",
            },
          ].map((metric, i) => {
            const colorClasses = {
              blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
              emerald:
                "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
              amber:
                "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
              red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
              purple:
                "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
            };

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`${colorClasses[metric.color as keyof typeof colorClasses]} rounded-xl p-4 border border-current/20`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
                    {metric.label}
                  </p>
                  <metric.icon className="w-4 h-4 opacity-60" />
                </div>
                <p className="text-2xl font-bold">{metric.value}</p>
              </motion.div>
            );
          })}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Building Occupancy Map */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Unit Status Grid
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Visual status of all property units
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Floor 1-3 Grid */}
              {[1, 2, 3].map((floor) => (
                <div key={floor}>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-3">
                    Floor {floor}
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {unitStatuses
                      .slice((floor - 1) * 5, floor * 5)
                      .map((unit) => {
                        const StatusIcon = unitStatusIcons[unit.status];
                        const bgClass = unitStatusColors[unit.status];
                        return (
                          <motion.button
                            key={unit.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedUnit(unit.id)}
                            className={`${bgClass} rounded-lg p-4 text-center border-2 transition-all cursor-pointer ${
                              selectedUnit === unit.id
                                ? "ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-950"
                                : ""
                            }`}
                          >
                            <StatusIcon className="w-5 h-5 mx-auto mb-2" />
                            <p className="text-xs font-bold">{unit.unit}</p>
                            <p className="text-xs capitalize opacity-75 mt-1">
                              {unit.status.replace("-", " ")}
                            </p>
                          </motion.button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Quick Stats Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Occupancy Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Occupancy Rate
              </h3>
              <div className="relative h-32 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-500">
                    {buildingStats.occupancyRate}%
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    {buildingStats.occupied} of {buildingStats.total} occupied
                  </p>
                </div>
              </div>
            </div>

            {/* Average Price Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Average Unit Price
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${buildingStats.avgPrice.toLocaleString()}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
                Based on {buildingStats.total} units
              </p>
            </div>

            {/* Status Legend */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Status Legend
              </h3>
              <div className="space-y-2">
                {Object.entries(unitStatusIcons).map(([status, Icon]) => (
                  <div key={status} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                      {status.replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Tenants & Inquiries Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Users className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Tenant Activity
            </h2>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {unitStatuses.slice(0, 8).map((unit) => (
              <div
                key={unit.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {unit.unit} - {unit.tenant}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                      Status: {unit.status.replace("-", " ")}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    ${unit.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
