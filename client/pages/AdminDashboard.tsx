import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building2, CircleDollarSign, ShieldCheck, Trash2, UserCog, Search } from "lucide-react";
import { Property, getProperties, deletePropertyById, updatePropertyStatus } from "@/lib/property-system";

type PlatformUser = {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller";
  suspended: boolean;
  deals: number;
};

const initialUsers: PlatformUser[] = [
  { id: "u-1", name: "Ethan Cooper", email: "ethan@demo.com", role: "buyer", suspended: false, deals: 4 },
  { id: "u-2", name: "Maya Bennett", email: "maya@demo.com", role: "seller", suspended: false, deals: 11 },
  { id: "u-3", name: "Noah Ellis", email: "noah@demo.com", role: "buyer", suspended: false, deals: 2 },
  { id: "u-4", name: "Olivia Carter", email: "olivia@demo.com", role: "seller", suspended: false, deals: 8 },
  { id: "u-5", name: "Lucas Young", email: "lucas@demo.com", role: "buyer", suspended: true, deals: 1 },
];

const cardMotion = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>(() => getProperties());
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "rejected" | "draft">("all");
  const [search, setSearch] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesStatus = statusFilter === "all" || property.status === statusFilter;
      const query = search.toLowerCase();
      const matchesSearch = !query || property.title.toLowerCase().includes(query) || property.location.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [properties, search, statusFilter]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalSellers = users.filter((user) => user.role === "seller").length;
    const totalProperties = properties.length;
    const activeListings = properties.filter((property) => property.status === "active").length;
    const pendingApprovals = properties.filter((property) => property.status === "pending").length;
    const totalRevenue = properties.reduce((sum, property) => sum + property.revenue, 0);

    return { totalUsers, totalSellers, totalProperties, activeListings, pendingApprovals, totalRevenue };
  }, [properties, users]);

  const analytics = useMemo(() => {
    const mostViewed = [...properties].sort((a, b) => b.views - a.views).slice(0, 5);
    const trendingLocations = Object.entries(
      properties.reduce<Record<string, number>>((acc, property) => {
        acc[property.location] = (acc[property.location] ?? 0) + property.views;
        return acc;
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sellerPerformance = Object.entries(
      properties.reduce<Record<string, number>>((acc, property) => {
        acc[property.sellerId] = (acc[property.sellerId] ?? 0) + property.revenue;
        return acc;
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { mostViewed, trendingLocations, sellerPerformance };
  }, [properties]);

  const updateStatus = (id: string, status: "active" | "pending" | "rejected" | "draft") => {
    setProperties(updatePropertyStatus(id, status));
  };

  const deleteListing = (id: string) => {
    setProperties(deletePropertyById(id));
  };

  const promoteUser = (id: string) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role: "seller" } : user)));
  };

  const toggleSuspend = (id: string) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, suspended: !user.suspended } : user)));
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-premium"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Platform control center</p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Statistics Cards */}
        <motion.section
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.06 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "indigo" },
            { label: "Total Sellers", value: stats.totalSellers, icon: UserCog, color: "blue" },
            { label: "Total Properties", value: stats.totalProperties, icon: Building2, color: "emerald" },
            { label: "Active Listings", value: stats.activeListings, icon: ShieldCheck, color: "amber" },
            { label: "Pending Approvals", value: stats.pendingApprovals, icon: ShieldCheck, color: "rose" },
            { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: CircleDollarSign, color: "indigo" },
          ].map((item) => {
            const colorMap: Record<string, { bg: string; text: string }> = {
              indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-600 dark:text-indigo-400" },
              blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400" },
              emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400" },
              amber: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400" },
              rose: { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-600 dark:text-rose-400" },
            };
            const colors = colorMap[item.color] || colorMap.indigo;
            return (
              <motion.div
                key={item.label}
                variants={cardMotion}
                className={`${colors.bg} rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.label}</p>
                  <item.icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-3">{item.value}</p>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Main Content */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 card-glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Property Management</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search..."
                    className="text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-auto">
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  whileHover={{ y: -2 }}
                  className="border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-4 bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{property.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {property.location} • ${property.price.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        property.status === "active"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : property.status === "pending"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(property.id, "active")}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(property.id, "rejected")}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => deleteListing(property.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-600 hover:bg-slate-700 text-white transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">User Management</h2>
            <div className="space-y-3 max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-4 bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all"
                >
                  <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{user.email}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium">
                      {user.role}
                    </span>
                    {user.suspended && (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-medium">
                        Suspended
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => promoteUser(user.id)}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      Promote
                    </button>
                    <button
                      onClick={() => toggleSuspend(user.id)}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                    >
                      {user.suspended ? "Unsuspend" : "Suspend"}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-600 hover:bg-slate-700 text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Most Viewed Properties</h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {analytics.mostViewed.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-slate-500 dark:text-slate-400">{item.views.toLocaleString()} views</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trending Locations</h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {analytics.trendingLocations.map(([location, value]) => (
                <li key={location} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-medium">{location}</span>
                  <span className="text-slate-500 dark:text-slate-400">{value.toLocaleString()} views</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Seller Performance</h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {analytics.sellerPerformance.map(([seller, value], index) => (
                <li key={seller} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-medium">#{index + 1} {seller}</span>
                  <span className="text-slate-500 dark:text-slate-400">${value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
