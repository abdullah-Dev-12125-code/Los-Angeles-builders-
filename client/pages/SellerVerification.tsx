import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  Briefcase,
} from "lucide-react";
import SellerVerificationForm, { SellerVerification, VerificationStatus } from "@/components/SellerVerificationForm";
import { useUserContext } from "@/lib/user-context";

export default function SellerVerificationPage() {
  const { userProfile } = useUserContext();
  const [submissions, setSubmissions] = useState<SellerVerification[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | "all">("all");

  // Mock current verification status
  const currentStatus: VerificationStatus = useMemo(() => {
    if (submissions.length === 0) return "pending";
    return submissions[submissions.length - 1].status;
  }, [submissions]);

  const filteredSubmissions = useMemo(
    () =>
      selectedStatus === "all"
        ? submissions
        : submissions.filter((s) => s.status === selectedStatus),
    [submissions, selectedStatus]
  );

  const handleSubmit = (data: Omit<SellerVerification, "id" | "createdAt" | "verifiedAt">) => {
    const newSubmission: SellerVerification = {
      ...data,
      id: `verification-${Date.now()}`,
      createdAt: new Date(),
      status: "pending",
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending Review",
      color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      textColor: "text-amber-700 dark:text-amber-300",
      badge: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100",
    },
    verified: {
      icon: CheckCircle2,
      label: "Verified",
      color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
      textColor: "text-emerald-700 dark:text-emerald-300",
      badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100",
    },
    rejected: {
      icon: AlertCircle,
      label: "Rejected",
      color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      textColor: "text-red-700 dark:text-red-300",
      badge: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
    },
  };

  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 backdrop-blur bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${config.color}`}>
                <Shield className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Seller Verification
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Complete your verification to unlock premium selling features
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-lg border ${config.color} flex items-center gap-2`}>
              <StatusIcon className={`w-5 h-5 ${config.textColor}`} />
              <span className={`font-semibold ${config.textColor}`}>
                {config.label}
              </span>
            </div>
          </div>

          {/* Timeline/Info */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-700 dark:text-slate-300">
              <p className="font-medium">Verification typically takes 24 hours.</p>
              <p className="text-xs mt-1">
                Our team will review your documents and contact you if additional information is needed.
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <SellerVerificationForm
              onSubmit={handleSubmit}
              initialStatus={currentStatus}
              isReadOnly={currentStatus === "verified"}
            />
          </motion.div>

          {/* Info Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Benefits Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                Verified Seller Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  "Premium profile badge",
                  "Higher listing visibility",
                  "Priority support",
                  "Advanced analytics",
                  "Bulk operations",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                Required Documents
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Valid government ID (CNIC)</li>
                <li>✓ Business registration</li>
                <li>✓ Phone verification</li>
                <li>✓ Email verification</li>
                <li>✓ Supporting document</li>
              </ul>
            </div>
          </motion.aside>
        </div>

        {/* Recent Submissions */}
        {submissions.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Submission History
              </h2>

              {/* Filter */}
              <div className="flex gap-2">
                {(["all", "pending", "verified", "rejected"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                      selectedStatus === status
                        ? "bg-red-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => {
                  const subConfig = statusConfig[submission.status];
                  const SubIcon = subConfig.icon;

                  return (
                    <motion.div
                      key={submission.id}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                      className="p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {submission.name}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${subConfig.badge}`}
                            >
                              {subConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {submission.email} • {submission.phone}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                            Submitted:{" "}
                            {submission.createdAt.toLocaleDateString()} at{" "}
                            {submission.createdAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <SubIcon className={`w-6 h-6 ${subConfig.textColor} flex-shrink-0`} />
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-600 dark:text-slate-400">
                  No submissions in this category
                </div>
              )}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
