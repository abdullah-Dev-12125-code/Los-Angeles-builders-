import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, TrendingUp, MessageSquare, Clock } from "lucide-react";
import { useUserContext } from "@/lib/user-context";
import { getProperties } from "@/lib/property-system";

interface PremiumBuyerHeaderProps {
  savedCount: number;
  recentInquiries: number;
}

export default function PremiumBuyerHeader({ savedCount, recentInquiries }: PremiumBuyerHeaderProps) {
  const { userProfile } = useUserContext();
  const properties = getProperties();

  const metrics = useMemo(
    () => ({
      saved: savedCount,
      inquiries: recentInquiries,
      active: properties.filter((p) => p.status === "active").length,
      trending: properties.filter((p) => p.views > 5000).length,
    }),
    [savedCount, recentInquiries, properties]
  );

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
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Hero Background */}
      <div className="relative overflow-hidden h-48 bg-gradient-to-r from-red-500/10 via-red-400/5 to-transparent dark:from-red-900/20 dark:via-red-800/10 dark:to-transparent">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/20 dark:bg-red-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="relative h-full flex items-center justify-between px-8 z-10">
          <div className="space-y-2">
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Welcome back, {userProfile.name.split(" ")[0]}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-600 dark:text-slate-300 font-medium"
            >
              Discover premium properties tailored to your preferences
            </motion.p>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 border-t border-slate-200 dark:border-slate-800">
        {[
          {
            icon: Heart,
            label: "Saved Properties",
            value: metrics.saved,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-900/20",
          },
          {
            icon: MessageSquare,
            label: "Recent Inquiries",
            value: metrics.inquiries,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
          },
          {
            icon: TrendingUp,
            label: "Active Listings",
            value: metrics.active,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
          },
          {
            icon: Clock,
            label: "Trending Now",
            value: metrics.trending,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`${metric.bg} rounded-xl p-4 border border-slate-200 dark:border-slate-700`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                {metric.label}
              </p>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
