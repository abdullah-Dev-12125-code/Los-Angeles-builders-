import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Send,
  Check,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ title, value, prefix = "", suffix = "", icon, color, trend }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {prefix}{count.toLocaleString()}{suffix}
          </h3>
          {trend && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default function SellerDashboard() {
  const [properties] = useState([
    { id: 1, title: "Modern Downtown Apartment", tenants: 2, revenue: 4500, status: "occupied" },
    { id: 2, title: "Beach House Villa", tenants: 1, revenue: 6000, status: "occupied" },
    { id: 3, title: "Suburban Family Home", tenants: 0, revenue: 0, status: "vacant" },
  ]);

  const [tenants] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      property: "Modern Downtown Apartment",
      rent: 2250,
      status: "paid",
      email: "sarah.j@example.com",
      phone: "+1 (555) 234-5678",
      leaseEnd: "2026-12-31",
    },
    {
      id: 2,
      name: "Michael Chen",
      property: "Beach House Villa",
      rent: 6000,
      status: "due",
      email: "m.chen@example.com",
      phone: "+1 (555) 345-6789",
      leaseEnd: "2026-10-15",
    },
    {
      id: 3,
      name: "Emily Davis",
      property: "Modern Downtown Apartment",
      rent: 2250,
      status: "overdue",
      email: "emily.d@example.com",
      phone: "+1 (555) 456-7890",
      leaseEnd: "2027-03-20",
    },
  ]);

  const [payments] = useState([
    { month: "January", amount: 10500, status: "received" },
    { month: "February", amount: 10500, status: "received" },
    { month: "March", amount: 4500, status: "partial" },
    { mouth: "April", amount: 0, status: "pending" },
  ]);

  const totalProperties = properties.length;
  const activeTenants = tenants.length;
  const monthlyRevenue = properties.reduce((sum, p) => sum + p.revenue, 0);
  const paymentsDue = tenants.filter((t) => t.status !== "paid").length;
  const occupancyRate = Math.round(
    (properties.filter((p) => p.status === "occupied").length / totalProperties) * 100
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
              Seller Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Manage your properties and tenants
            </p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              title="Total Properties"
              value={totalProperties}
              icon={<Home className="w-6 h-6 text-blue-600" />}
              color="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50"
            />
            <StatCard
              title="Active Tenants"
              value={activeTenants}
              icon={<Users className="w-6 h-6 text-purple-600" />}
              color="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50"
            />
            <StatCard
              title="Monthly Revenue"
              value={monthlyRevenue}
              prefix="$"
              icon={<DollarSign className="w-6 h-6 text-green-600" />}
              color="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50"
              trend="+12% from last month"
            />
            <StatCard
              title="Payments Due"
              value={paymentsDue}
              icon={<AlertCircle className="w-6 h-6 text-red-600" />}
              color="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50"
            />
            <StatCard
              title="Occupancy Rate"
              value={occupancyRate}
              suffix="%"
              icon={<TrendingUp className="w-6 h-6 text-amber-600" />}
              color="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50"
            />
          </div>
        </motion.div>

        {/* My Properties */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Properties</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Property
            </motion.button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Tenants
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {properties.map((property) => (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{property.title}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{property.tenants}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                        ${property.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            property.status === "occupied"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Tenant Management */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tenant Management</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Tenant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Rent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Payment Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Lease End
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {tenants.map((tenant) => (
                    <motion.tr
                      key={tenant.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{tenant.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{tenant.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{tenant.property}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                        ${tenant.rent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                            tenant.status === "paid"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                              : tenant.status === "due"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                          }`}
                        >
                          {tenant.status === "paid" && <Check className="w-3 h-3" />}
                          {tenant.status === "overdue" && <AlertCircle className="w-3 h-3" />}
                          {tenant.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {tenant.leaseEnd}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tenant.status !== "paid" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1 hover:shadow-md transition-all"
                          >
                            <Send className="w-3 h-3" />
                            Remind
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Payment Tracker */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Payment Tracker</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {payments.map((payment, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{payment.month}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  ${payment.amount.toLocaleString()}
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {payment.status === "received"
                        ? "100%"
                        : payment.status === "partial"
                        ? "43%"
                        : "0%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          payment.status === "received"
                            ? "100%"
                            : payment.status === "partial"
                            ? "43%"
                            : "0%",
                      }}
                      transition={{ duration: 1, delay: idx * 0.1 + 0.3 }}
                      className={`h-2 rounded-full ${
                        payment.status === "received"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : payment.status === "partial"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Analytics Placeholder */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-semibold">
              Revenue & Occupancy Charts
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Advanced analytics coming soon
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
