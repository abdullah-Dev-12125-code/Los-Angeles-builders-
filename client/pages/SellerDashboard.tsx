import { FormEvent, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, MessageSquare, PlusCircle, Trash2, Pencil, CheckCircle2, AlertCircle,
  TrendingUp, Home, BarChart3, DollarSign, Users, Clock, Upload, Building2
} from "lucide-react";
import { Property, PropertyStatus, getProperties, upsertProperty, deletePropertyById, updatePropertyStatus } from "@/lib/property-system";
import { getRandomPropertyImage } from "@/lib/image-service";
import ManageBuildings from "@/components/ManageBuildings";

type FormState = {
  title: string;
  description: string;
  price: string;
  location: string;
  type: Property["type"];
  bedrooms: string;
  bathrooms: string;
  area: string;
  amenities: string;
  images: string;
  featuredImage: string;
  status: "active" | "draft";
};

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  price: "",
  location: "",
  type: "residential",
  bedrooms: "0",
  bathrooms: "0",
  area: "",
  amenities: "",
  images: "",
  featuredImage: "",
  status: "active",
};

const SELLER_ID = "seller-1";

export default function SellerDashboard() {
  const [properties, setProperties] = useState<Property[]>(() => getProperties());
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "buildings">("properties");

  // Get seller's properties
  const sellerProperties = useMemo(
    () => properties.filter((p) => p.sellerId === SELLER_ID),
    [properties]
  );

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = sellerProperties.length;
    const active = sellerProperties.filter((p) => p.status === "active").length;
    const pending = sellerProperties.filter((p) => p.status === "pending").length;
    const totalInquiries = sellerProperties.reduce((sum, p) => sum + p.inquiries, 0);
    const totalRevenue = sellerProperties.reduce((sum, p) => sum + p.revenue, 0);
    const avgPrice = total > 0 ? sellerProperties.reduce((sum, p) => sum + p.price, 0) / total : 0;

    return { total, active, pending, totalInquiries, totalRevenue, avgPrice };
  }, [sellerProperties]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!form.title.trim()) errors.title = "Title required";
    if (!form.description.trim()) errors.description = "Description required";
    if (!form.price || Number(form.price) <= 0) errors.price = "Valid price required";
    if (!form.location.trim()) errors.location = "Location required";
    if (!form.area || Number(form.area) <= 0) errors.area = "Valid area required";

    const images = form.images.split(",").map((url) => url.trim()).filter(Boolean);
    if (images.length === 0) errors.images = "At least one image required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  // Map form to property
  const mapFormToProperty = useCallback((status: PropertyStatus): Property => {
    const imageList = form.images.split(",").map((url) => url.trim()).filter(Boolean);
    const safeImages = imageList.length > 0 ? imageList : [getRandomPropertyImage().url];
    const featuredImage = form.featuredImage.trim() || safeImages[0];

    return {
      id: editingId ?? `property-${Date.now()}`,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      location: form.location,
      type: form.type,
      bedrooms: Number(form.bedrooms || 0),
      bathrooms: Number(form.bathrooms || 0),
      area: Number(form.area),
      amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
      images: safeImages,
      featuredImage,
      rating: 4.5,
      reviews: 0,
      sellerId: SELLER_ID,
      status,
      views: 0,
      revenue: 0,
      inquiries: 0,
      createdAt: new Date(),
    };
  }, [editingId, form]);

  // Handle form submit
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const status: PropertyStatus = form.status === "draft" ? "draft" : "pending";
    const property = mapFormToProperty(status);
    setProperties(upsertProperty(property));

    setSuccessMessage(editingId ? "Property updated successfully!" : "Property submitted for review!");
    setEditingId(null);
    setForm(INITIAL_FORM);
    setIsFormOpen(false);

    setTimeout(() => setSuccessMessage(""), 3000);
  }, [validateForm, mapFormToProperty, form.status, editingId]);

  // Handle edit
  const startEdit = useCallback((property: Property) => {
    setEditingId(property.id);
    setForm({
      title: property.title,
      description: property.description,
      price: String(property.price),
      location: property.location,
      type: property.type,
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      area: String(property.area),
      amenities: property.amenities.join(", "),
      images: property.images.join(", "),
      featuredImage: property.featuredImage,
      status: property.status === "draft" ? "draft" : "active",
    });
    setIsFormOpen(true);
  }, []);

  // Handle delete
  const handleDelete = useCallback((id: string) => {
    if (confirm("Delete this property? This cannot be undone.")) {
      setProperties(deletePropertyById(id));
    }
  }, []);

  // Handle toggle active/draft
  const toggleStatus = useCallback((property: Property) => {
    const newStatus: PropertyStatus = property.status === "active" ? "draft" : "active";
    setProperties(updatePropertyStatus(property.id, newStatus));
  }, []);

  // Sort properties for display
  const sortedProperties = useMemo(() => {
    return [...sellerProperties].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [sellerProperties]);

  // Get inquiries
  const recentInquiries = useMemo(() => {
    return sortedProperties
      .filter((p) => p.inquiries > 0)
      .sort((a, b) => b.inquiries - a.inquiries)
      .slice(0, 8);
  }, [sortedProperties]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Seller Dashboard</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your property listings and inquiries</p>
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setForm(INITIAL_FORM);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium inline-flex items-center gap-2 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Add Property
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 border-b border-slate-200 dark:border-slate-800"
        >
          {[
            { id: "properties", label: "Properties", icon: Home },
            { id: "buildings", label: "Manage Buildings", icon: Building2 },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "properties" | "buildings")}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900 dark:border-emerald-700 p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "properties" ? (
            <motion.div
              key="properties"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >

        {/* Overview Metrics */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Home, label: "Total Listings", value: metrics.total, color: "indigo" },
              { icon: BarChart3, label: "Active", value: metrics.active, color: "emerald" },
              { icon: Clock, label: "Pending", value: metrics.pending, color: "amber" },
              { icon: Users, label: "Inquiries", value: metrics.totalInquiries, color: "blue" },
              { icon: TrendingUp, label: "Revenue", value: `$${metrics.totalRevenue.toLocaleString()}`, color: "indigo" },
            ].map((item, i) => {
              const iconColor = {
                blue: "text-blue-500",
                emerald: "text-emerald-500",
                amber: "text-amber-500",
                indigo: "text-indigo-600",
              }[item.color];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
                    <item.icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Property Form */}
          <motion.section className="lg:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                {editingId ? "Edit Property" : "Add Property"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { key: "title", label: "Title", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "location", label: "Location", type: "text" },
                { key: "price", label: "Price ($)", type: "number" },
                { key: "area", label: "Area (sq ft)", type: "number" },
                { key: "bedrooms", label: "Bedrooms", type: "number" },
                { key: "bathrooms", label: "Bathrooms", type: "number" },
                { key: "amenities", label: "Amenities (comma separated)", type: "text" },
                { key: "images", label: "Images (comma separated URLs) *", type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-red-500/20 focus:border-red-300 outline-none min-h-20"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-red-500/20 focus:border-red-300 outline-none"
                    />
                  )}
                  {formErrors[field.key] && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors[field.key]}
                    </p>
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as Property["type"] }))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 outline-none"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "active" | "draft" }))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors mt-2"
              >
                {editingId ? "Update Property" : "Submit Property"}
              </button>
            </form>
          </motion.section>

          {/* Listings & Inquiries */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Listings */}
            <motion.section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-red-500" />
                  Your Listings ({sellerProperties.length})
                </h2>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {sortedProperties.length > 0 ? (
                  sortedProperties.map((property) => (
                    <div
                      key={property.id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex gap-4">
                        <img
                          src={property.featuredImage}
                          alt={property.title}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{property.title}</h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                                property.status === "active"
                                  ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                              }`}
                            >
                              {property.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{property.location}</p>
                          <p className="font-semibold text-slate-900 dark:text-white mt-1">${property.price.toLocaleString()}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => startEdit(property)}
                              className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors inline-flex items-center gap-1"
                            >
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                            <button
                              onClick={() => toggleStatus(property)}
                              className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                              {property.status === "active" ? "Archive" : "Activate"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Home className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-600 dark:text-slate-400">No listings yet. Add your first property!</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Recent Inquiries */}
            <motion.section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Recent Inquiries ({metrics.totalInquiries})
                </h2>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentInquiries.length > 0 ? (
                  recentInquiries.map((property) => (
                    <div key={property.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{property.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{property.inquiries} inquiries</p>
                      </div>
                      <button className="text-xs px-3 py-1 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                        Reply
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-600 dark:text-slate-400">No inquiries yet</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
            </motion.div>
          ) : (
            <motion.div
              key="buildings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ManageBuildings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
