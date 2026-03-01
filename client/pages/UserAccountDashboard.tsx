import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Heart,
  MessageSquare,
  DollarSign,
  Calendar,
  Settings,
  LogOut,
  Edit2,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface UserSummaryCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: "up" | "down";
  color: string;
}

export default function UserAccountDashboard() {
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Anderson",
    email: "john.anderson@example.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA",
    member_since: "March 2024",
  });

  // Summary cards data
  const summaryCards: UserSummaryCard[] = [
    {
      icon: <Home className="w-8 h-8" />,
      label: "Active Listings",
      value: 12,
      sublabel: "properties",
      color: "indigo",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      label: "Saved",
      value: 38,
      sublabel: "favorites",
      color: "rose",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      label: "Messages",
      value: 5,
      sublabel: "new inquiries",
      color: "blue",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      label: "Revenue",
      value: "$24.5K",
      sublabel: "this month",
      color: "emerald",
    },
  ];

  // Sidebar navigation
  const navItems = [
    { icon: <User className="w-5 h-5" />, label: "Profile", action: () => setIsEditingProfile(!isEditingProfile) },
    { icon: <Home className="w-5 h-5" />, label: "My Properties", action: () => navigate("/properties") },
    { icon: <Heart className="w-5 h-5" />, label: "Saved Items", action: () => {} },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Messages", action: () => {} },
    { icon: <Calendar className="w-5 h-5" />, label: "Bookings", action: () => {} },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", action: () => {} },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-600" },
      rose: { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-600" },
      blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600" },
      emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600" },
    };
    return colors[color] || colors.indigo;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-premium"
    >
      {/* Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.08, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Account</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Welcome back, {userData.name.split(" ")[0]}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Cards Grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, idx) => {
              const colors = getColorClasses(card.color);
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className={`${colors.bg} rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`${colors.text}`}>{card.icon}</div>
                    {card.trend && (
                      <span
                        className={`text-xs font-semibold ${
                          card.trend === "up" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {card.trend === "up" ? "↑" : "↓"} 12%
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</p>
                    {card.sublabel && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.sublabel}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Profile & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 card-glass rounded-2xl p-6 h-fit"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">
              Menu
            </h3>
            <nav className="space-y-2">
              {navItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 4 }}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 card-glass rounded-2xl p-8"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Member since {userData.member_since}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
              >
                <Edit2 className="w-4 h-4" />
                {isEditingProfile ? "Done" : "Edit"}
              </motion.button>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white font-medium">{userData.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                {isEditingProfile ? (
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white font-medium">{userData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                {isEditingProfile ? (
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white font-medium">{userData.phone}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={userData.location}
                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white font-medium">{userData.location}</p>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">
                Account Stats
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">24</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Total Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">156</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Total Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">8</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Active Deals</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
