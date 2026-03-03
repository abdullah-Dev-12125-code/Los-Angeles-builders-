import { FormEvent, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, MessageSquare, PlusCircle, Trash2, Pencil, CheckCircle2, AlertCircle,
  TrendingUp, Home, BarChart3, DollarSign, Users, Clock, Upload, Building2, Wifi, WifiOff, BellRing, ReceiptText
} from "lucide-react";
import { Property, PropertyStatus, getProperties, upsertProperty, deletePropertyById, updatePropertyStatus } from "@/lib/property-system";
import { getRandomPropertyImage } from "@/lib/image-service";
import ManageBuildings from "@/components/ManageBuildings";
import { addSellerMessage, getSellerCommunicationSettings, updateSellerCommunicationSettings } from "@/lib/seller-communication";
import PremiumShell from "@/components/PremiumShell";
import { useUserContext } from "@/lib/user-context";

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

const SELLER_NAV_ITEMS = [
  { label: "Overview", to: "/seller" },
  { label: "Command Center", to: "/command-center" },
  { label: "Verification", to: "/seller-verification" },
  { label: "Seller Pro", to: "/seller-pro" },
];

export default function SellerDashboard() {
  const { userProfile } = useUserContext();
  const [properties, setProperties] = useState<Property[]>(() => getProperties());
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "buildings">("properties");
  const [communicationSettings, setCommunicationSettings] = useState(() => getSellerCommunicationSettings(SELLER_ID));
  const [noticeType, setNoticeType] = useState<"warning" | "notification" | "rent" | "tax">("notification");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeAmount, setNoticeAmount] = useState("");

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

  const updateRemoteMode = useCallback((allowRemoteConnection: boolean) => {
    const next = updateSellerCommunicationSettings(SELLER_ID, { allowRemoteConnection });
    setCommunicationSettings(next);
    setSuccessMessage(allowRemoteConnection ? "Online buyer connection enabled." : "Remote connection disabled for buyers.");
    setTimeout(() => setSuccessMessage(""), 2500);
  }, []);

  const handleSendBuyerMessage = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) {
      setSuccessMessage("Please provide both title and message before sending.");
      setTimeout(() => setSuccessMessage(""), 2500);
      return;
    }

    addSellerMessage(SELLER_ID, {
      type: noticeType,
      title: noticeTitle.trim(),
      message: noticeMessage.trim(),
      amount: noticeAmount ? Number(noticeAmount) : undefined,
    });

    setNoticeTitle("");
    setNoticeMessage("");
    setNoticeAmount("");
    setSuccessMessage("Buyer update sent successfully.");
    setTimeout(() => setSuccessMessage(""), 2500);
  }, [noticeAmount, noticeMessage, noticeTitle, noticeType]);

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
    <PremiumShell
      userName={userProfile.name}
      userEmail={userProfile.email}
      userImage={userProfile.profileImage}
      navItems={SELLER_NAV_ITEMS}
    >
      <main className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6 space-y-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
              <p className="mt-1 text-sm text-slate-600">Manage listings, notifications, buyer connections, and billing from one place.</p>
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setForm(INITIAL_FORM);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-yellow-200 hover:bg-yellow-300 text-slate-900 font-medium inline-flex items-center gap-2 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Add Property
            </button>
          </div>
        </section>
        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 border-b border-slate-200"
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
                    ? "border-yellow-500 text-slate-900"
                    : "border-transparent text-slate-600 hover:text-slate-900"
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
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium text-emerald-600">{successMessage}</span>
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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Connect Option</h2>
            <p className="text-sm text-slate-600 mb-4">
              Allow buyers to connect with you online only when you want to.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateRemoteMode(true)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  communicationSettings.allowRemoteConnection
                    ? "bg-yellow-100 text-slate-900"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Wifi className="w-4 h-4" /> Operate Remotely
              </button>
              <button
                onClick={() => updateRemoteMode(false)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !communicationSettings.allowRemoteConnection
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <WifiOff className="w-4 h-4" /> No Remote Operations
              </button>
            </div>
          </motion.div>

          <motion.form onSubmit={handleSendBuyerMessage} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Buyer Notifications</h2>
            <p className="text-sm text-slate-600">
              Send warnings, notifications, rent bills, or tax notices through the app.
            </p>
            <select
              value={noticeType}
              onChange={(e) => setNoticeType(e.target.value as "warning" | "notification" | "rent" | "tax")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-yellow-400 outline-none"
            >
              <option value="notification">General Notification</option>
              <option value="warning">Warning</option>
              <option value="rent">Rent Bill</option>
              <option value="tax">Tax Notice</option>
            </select>
            <input
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-yellow-400 outline-none"
            />
            <textarea
              value={noticeMessage}
              onChange={(e) => setNoticeMessage(e.target.value)}
              placeholder="Message for buyers"
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-yellow-400 outline-none"
            />
            {(noticeType === "rent" || noticeType === "tax") && (
              <input
                value={noticeAmount}
                onChange={(e) => setNoticeAmount(e.target.value)}
                type="number"
                placeholder="Amount (optional)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-yellow-400 outline-none"
              />
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-200 hover:bg-yellow-300 text-slate-900 text-sm font-medium transition-colors"
            >
              <BellRing className="w-4 h-4" /> Send Update
            </button>
          </motion.form>
        </section>

        {/* Overview Metrics */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Home, label: "Total Listings", value: metrics.total, color: "slate" },
              { icon: BarChart3, label: "Active", value: metrics.active, color: "emerald" },
              { icon: Clock, label: "Pending", value: metrics.pending, color: "amber" },
              { icon: Users, label: "Inquiries", value: metrics.totalInquiries, color: "blue" },
              { icon: TrendingUp, label: "Revenue", value: `$${metrics.totalRevenue.toLocaleString()}`, color: "yellow" },
            ].map((item, i) => {
              const iconColor = {
                blue: "text-blue-500",
                emerald: "text-emerald-500",
                amber: "text-amber-500",
                slate: "text-slate-700",
                yellow: "text-yellow-600",
              }[item.color];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    <item.icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Billing System</h3>
            <p className="mt-2 text-sm text-slate-600">Collected Revenue</p>
            <p className="text-2xl font-semibold text-slate-900">${metrics.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Pending Billing</h3>
            <p className="mt-2 text-sm text-slate-600">Based on pending listings</p>
            <p className="text-2xl font-semibold text-slate-900">${(metrics.pending * 250).toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Average Listing Value</h3>
            <p className="mt-2 text-sm text-slate-600">Calculated from your inventory</p>
            <p className="text-2xl font-semibold text-slate-900">${Math.round(metrics.avgPrice).toLocaleString()}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Property Form */}
          <motion.section className="lg:col-span-1 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-yellow-600" />
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 outline-none min-h-20"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 outline-none"
                    />
                  )}
                  {formErrors[field.key] && (
                    <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors[field.key]}
                    </p>
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as Property["type"] }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 outline-none"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "active" | "draft" }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-yellow-200 hover:bg-yellow-300 text-slate-900 font-medium transition-colors mt-2"
              >
                {editingId ? "Update Property" : "Submit Property"}
              </button>
            </form>
          </motion.section>

          {/* Listings & Inquiries */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Listings */}
            <motion.section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-yellow-600" />
                  Your Listings ({sellerProperties.length})
                </h2>
              </div>

              <div className="divide-y divide-slate-200">
                {sortedProperties.length > 0 ? (
                  sortedProperties.map((property) => (
                    <div
                      key={property.id}
                      className="p-4 hover:bg-slate-50 transition-colors"
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
                            <h3 className="font-semibold text-slate-900 truncate">{property.title}</h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                                property.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {property.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 truncate">{property.location}</p>
                          <p className="font-semibold text-slate-900 mt-1">${property.price.toLocaleString()}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => startEdit(property)}
                              className="text-xs px-2 py-1 rounded bg-yellow-100 text-slate-800 hover:bg-yellow-200 transition-colors inline-flex items-center gap-1"
                            >
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                            <button
                              onClick={() => toggleStatus(property)}
                              className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
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
                    <Home className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600">No listings yet. Add your first property!</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Recent Inquiries */}
            <motion.section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                  Recent Inquiries ({metrics.totalInquiries})
                </h2>
              </div>

              <div className="divide-y divide-slate-200">
                {recentInquiries.length > 0 ? (
                  recentInquiries.map((property) => (
                    <div key={property.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{property.title}</p>
                        <p className="text-sm text-slate-600">{property.inquiries} inquiries</p>
                      </div>
                      <button className="text-xs px-3 py-1 rounded bg-yellow-100 text-slate-800 hover:bg-yellow-200 transition-colors">
                        Reply
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600">No inquiries yet</p>
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
    </PremiumShell>
  );
}
