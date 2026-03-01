import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Home, TrendingUp, Users, AlertCircle, MessageSquare, BarChart3, Shield,
  Plus, Edit2, Trash2, Star, Eye, Heart, Lock, Settings, Calendar,
  Bell, FileText, CheckCircle, Clock, DollarSign, MapPin, Image as ImageIcon,
  Search, Filter, Download, Share2, ArrowUp, ArrowDown, Zap, Target,
  Building2, UserCheck, RefreshCw, MoreHorizontal, ChevronDown, ChevronUp,
  LineChart, PieChart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  status: 'active' | 'inactive' | 'draft';
  views: number;
  inquiries: number;
  favorites: number;
  images: number;
  rating: number;
  dateListed: string;
  isHot?: boolean;
  isTrending?: boolean;
  needsAttention?: boolean;
}

interface Message {
  id: string;
  buyerName: string;
  property: string;
  message: string;
  unread: boolean;
  timestamp: string;
}

interface Analytics {
  topProperties: Property[];
  revenueData: { month: string; revenue: number }[];
  occupancyRate: number;
  avgPropertyPrice: number;
}

interface VerificationStatus {
  status: 'pending' | 'verified' | 'rejected';
  complianceScore: number;
  documents: string[];
}

const SellerDashboardPro: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      title: 'Modern Apartment Downtown',
      price: 450000,
      location: 'Downtown LA',
      status: 'active',
      views: 1240,
      inquiries: 34,
      favorites: 127,
      images: 8,
      rating: 4.8,
      dateListed: '2024-01-15',
      isHot: true,
      isTrending: true,
    },
    {
      id: '2',
      title: 'Luxury Villa with Pool',
      price: 850000,
      location: 'Beverly Hills',
      status: 'active',
      views: 2100,
      inquiries: 45,
      favorites: 203,
      images: 12,
      rating: 4.9,
      dateListed: '2024-01-10',
      isHot: true,
    },
    {
      id: '3',
      title: 'Cozy Studio Apartment',
      price: 250000,
      location: 'Santa Monica',
      status: 'draft',
      views: 0,
      inquiries: 0,
      favorites: 0,
      images: 4,
      rating: 0,
      dateListed: '2024-02-20',
      needsAttention: true,
    },
  ]);

  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    management: true,
    analytics: true,
  });

  const [verificationStatus] = useState<VerificationStatus>({
    status: 'verified',
    complianceScore: 92,
    documents: ['CNIC', 'Business License', 'Tax ID'],
  });

  const [unreadMessages] = useState<Message[]>([
    {
      id: '1',
      buyerName: 'Ahmed Khan',
      property: 'Modern Apartment Downtown',
      message: 'Is the apartment available this month?',
      unread: true,
      timestamp: '5m ago',
    },
    {
      id: '2',
      buyerName: 'Sarah Hassan',
      property: 'Luxury Villa with Pool',
      message: 'Can we schedule a viewing?',
      unread: true,
      timestamp: '12m ago',
    },
  ]);

  // Memoized calculations
  const metrics = useMemo(
    () => ({
      totalProperties: properties.length,
      activeListings: properties.filter((p) => p.status === 'active').length,
      pendingApprovals: properties.filter((p) => p.status === 'draft').length,
      totalInquiries: properties.reduce((sum, p) => sum + p.inquiries, 0),
      totalRevenue: properties
        .filter((p) => p.status === 'active')
        .reduce((sum, p) => sum + p.price * 0.01, 0), // Mock 1% revenue
      avgRating:
        (properties.reduce((sum, p) => sum + p.rating, 0) / properties.length).toFixed(1) ||
        0,
      occupancyRate: ((properties.filter((p) => p.status === 'active').length / properties.length) * 100).toFixed(0),
      hotProperties: properties.filter((p) => p.isHot),
      attentionNeeded: properties.filter((p) => p.needsAttention),
    }),
    [properties]
  );

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleDeleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleStatusToggle = useCallback((id: string, newStatus: 'active' | 'inactive' | 'draft') => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  }, []);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardHoverVariants = {
    rest: { y: 0 },
    hover: { y: -8, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] dark:from-[#0A0F1A] dark:to-[#1B1F32] p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Seller Dashboard</h1>
              <p className="text-[#A8DADC]">
                {verificationStatus.status === 'verified' ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2A9D8F]" />
                    Verified Seller • Compliance Score: {verificationStatus.complianceScore}%
                  </span>
                ) : (
                  'Pending Verification'
                )}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#E63946] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Property
            </motion.button>
          </div>
        </motion.div>

        {/* Section A: Overview Cards */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Properties', value: metrics.totalProperties, icon: Home, color: 'text-blue-400' },
              { label: 'Active Listings', value: metrics.activeListings, icon: TrendingUp, color: 'text-green-400' },
              { label: 'Pending Approvals', value: metrics.pendingApprovals, icon: Clock, color: 'text-yellow-400' },
              { label: 'Total Inquiries', value: metrics.totalInquiries, icon: MessageSquare, color: 'text-purple-400' },
              { label: 'Revenue (Month)', value: `$${(metrics.totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-emerald-400' },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                className="bg-[#1B263B] dark:bg-[#1B1F32] border border-[#2A3F5F] rounded-xl p-6 backdrop-blur-sm hover:border-[#E63946] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#A8DADC] text-sm font-medium">{metric.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
                  </div>
                  <metric.icon className={`w-12 h-12 ${metric.color} opacity-40`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section B: Property Management */}
        <motion.div
          variants={itemVariants}
          className="mb-8 bg-[#1B263B] dark:bg-[#1B1F32] border border-[#2A3F5F] rounded-xl overflow-hidden"
        >
          <motion.button
            onClick={() => toggleSection('management')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2A3F5F] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#E63946]" />
              <h2 className="text-xl font-bold text-white">Property Management</h2>
            </div>
            {expandedSections.management ? (
              <ChevronUp className="w-5 h-5 text-[#A8DADC]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#A8DADC]" />
            )}
          </motion.button>

          <AnimatePresence>
            {expandedSections.management && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-4 border-t border-[#2A3F5F] space-y-4"
              >
                {properties.map((prop, idx) => (
                  <motion.div
                    key={prop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#0D1B2A] dark:bg-[#0A0F1A] rounded-lg p-4 border border-[#2A3F5F] hover:border-[#E63946] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{prop.title}</h3>
                          {prop.isHot && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                              🔥 Hot
                            </span>
                          )}
                          {prop.needsAttention && (
                            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
                              ⚠️ Attention
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-[#A8DADC]">Location</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {prop.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#A8DADC]">Price</p>
                            <p className="text-white font-medium">${prop.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[#A8DADC]">Views</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <Eye className="w-4 h-4" /> {prop.views}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#A8DADC]">Inquiries</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" /> {prop.inquiries}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#A8DADC]">Status</p>
                            <p className={`text-white font-medium capitalize px-2 py-1 rounded text-xs w-fit ${
                              prop.status === 'active' ? 'bg-green-600' :
                              prop.status === 'inactive' ? 'bg-gray-600' : 'bg-yellow-600'
                            }`}>
                              {prop.status}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleStatusToggle(prop.id, prop.status === 'active' ? 'inactive' : 'active')}
                          className="p-2 hover:bg-[#2A3F5F] rounded-lg transition-colors text-[#A8DADC] hover:text-white"
                        >
                          <Zap className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-[#2A3F5F] rounded-lg transition-colors text-[#A8DADC] hover:text-white"
                        >
                          <Edit2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-[#A8DADC] hover:text-red-400"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section C: Messages & Interactions */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="lg:col-span-2 bg-[#1B263B] dark:bg-[#1B1F32] border border-[#2A3F5F] rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#E63946]" />
                Recent Messages
              </h2>
              <span className="bg-[#E63946] text-white text-xs font-bold px-3 py-1 rounded-full">
                {unreadMessages.length} Unread
              </span>
            </div>
            <div className="space-y-3">
              {unreadMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#0D1B2A] dark:bg-[#0A0F1A] p-4 rounded-lg border-l-4 border-[#E63946] hover:border-[#F4A261] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">{msg.buyerName}</p>
                      <p className="text-[#A8DADC] text-sm">{msg.property}</p>
                      <p className="text-gray-400 text-sm mt-1">{msg.message}</p>
                    </div>
                    <p className="text-[#A8DADC] text-xs whitespace-nowrap">{msg.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="bg-gradient-to-br from-[#E63946] to-[#E63946]/80 rounded-xl p-6 text-white"
          >
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Favorites
                </span>
                <span className="font-bold text-lg">
                  {properties.reduce((sum, p) => sum + p.favorites, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5" /> Avg Rating
                </span>
                <span className="font-bold text-lg">{metrics.avgRating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Occupancy
                </span>
                <span className="font-bold text-lg">{metrics.occupancyRate}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section D: Analytics */}
        <motion.div
          variants={itemVariants}
          className="bg-[#1B263B] dark:bg-[#1B1F32] border border-[#2A3F5F] rounded-xl overflow-hidden mb-8"
        >
          <motion.button
            onClick={() => toggleSection('analytics')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2A3F5F] transition-colors"
          >
            <div className="flex items-center gap-2">
              <LineChart className="w-6 h-6 text-[#F4A261]" />
              <h2 className="text-xl font-bold text-white">Analytics & Insights</h2>
            </div>
            {expandedSections.analytics ? (
              <ChevronUp className="w-5 h-5 text-[#A8DADC]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#A8DADC]" />
            )}
          </motion.button>

          <AnimatePresence>
            {expandedSections.analytics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-4 border-t border-[#2A3F5F]"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Performing Properties */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0D1B2A] dark:bg-[#0A0F1A] p-4 rounded-lg border border-[#2A3F5F]"
                  >
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#2A9D8F]" /> Top Performers
                    </h3>
                    <div className="space-y-2">
                      {properties
                        .sort((a, b) => b.inquiries - a.inquiries)
                        .slice(0, 3)
                        .map((prop) => (
                          <div key={prop.id} className="flex items-center justify-between text-sm">
                            <span className="text-[#A8DADC]">{prop.title}</span>
                            <span className="text-emerald-400 font-semibold">{prop.inquiries} inquiries</span>
                          </div>
                        ))}
                    </div>
                  </motion.div>

                  {/* Revenue Chart Mock */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0D1B2A] dark:bg-[#0A0F1A] p-4 rounded-lg border border-[#2A3F5F]"
                  >
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#F4A261]" /> Revenue Trend
                    </h3>
                    <div className="space-y-2">
                      {[
                        { month: 'Jan', revenue: 12000 },
                        { month: 'Feb', revenue: 15000 },
                        { month: 'Mar', revenue: 18000 },
                      ].map((data) => (
                        <div key={data.month} className="flex items-center justify-between text-sm">
                          <span className="text-[#A8DADC] w-10">{data.month}</span>
                          <div className="flex-1 mx-3 bg-[#2A3F5F] rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(data.revenue / 20000) * 100}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="bg-gradient-to-r from-[#F4A261] to-[#E63946] h-full"
                            />
                          </div>
                          <span className="text-emerald-400 font-semibold w-16 text-right">
                            ${data.revenue / 1000}K
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Section E: Verification & Trust */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-[#2A9D8F] to-[#2A9D8F]/80 rounded-xl p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Shield className="w-7 h-7" />
                Seller Verification Status
              </h2>
              <p className="opacity-90">
                Compliance Score: {verificationStatus.complianceScore}% • Verified Documents: {verificationStatus.documents.length}
              </p>
            </div>
            <CheckCircle className="w-16 h-16 opacity-40" />
          </div>
        </motion.div>

        {/* Section F: Feature Extras */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Suggested Improvements */}
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="bg-[#1B263B] dark:bg-[#1B1F32] border border-[#2A3F5F] rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#F4A261]" />
              AI Suggestions
            </h3>
            <div className="space-y-3">
              {[
                'Add 2-3 more high-quality images to boost engagement',
                'Reduce price by 5% to match market trends',
                'Highlight parking & garden in description',
              ].map((suggestion, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#0D1B2A] dark:bg-[#0A0F1A] p-3 rounded border-l-4 border-[#F4A261]"
                >
                  <p className="text-[#A8DADC] text-sm">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Market Trends & Alerts */}
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="bg-[#1B263B] dark:bg-[#1B1F32] border border-[#2A3F5F] rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#E63946]" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {[
                { alert: 'Hot property! 50+ views today', icon: TrendingUp, color: 'text-emerald-400' },
                { alert: 'New inquiry from verified buyer', icon: UserCheck, color: 'text-blue-400' },
                { alert: 'Your listing is trending in area', icon: Target, color: 'text-yellow-400' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 bg-[#0D1B2A] dark:bg-[#0A0F1A] p-3 rounded border border-[#2A3F5F]"
                >
                  <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                  <p className="text-[#A8DADC] text-sm">{item.alert}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SellerDashboardPro;
