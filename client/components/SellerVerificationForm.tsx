import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  Phone,
  Mail,
  FileText,
} from "lucide-react";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface SellerVerification {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  businessReg: string;
  documentUrl: string;
  status: VerificationStatus;
  createdAt: Date;
  verifiedAt?: Date;
}

interface SellerVerificationFormProps {
  onSubmit?: (data: Omit<SellerVerification, "id" | "createdAt" | "verifiedAt">) => void;
  initialStatus?: VerificationStatus;
  isReadOnly?: boolean;
}

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  cnic: "",
  businessReg: "",
  documentUrl: "",
  status: "pending" as VerificationStatus,
};

export default function SellerVerificationForm({
  onSubmit,
  initialStatus = "pending",
  isReadOnly = false,
}: SellerVerificationFormProps) {
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    status: initialStatus,
  });
  const [step, setStep] = useState<"form" | "review" | "submitted">("form");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Full name required";
    if (!form.email.trim() || !form.email.includes("@"))
      newErrors.email = "Valid email required";
    if (!form.phone.trim() || form.phone.length < 10)
      newErrors.phone = "Valid phone required";
    if (!form.cnic.trim() || form.cnic.length < 13)
      newErrors.cnic = "Valid CNIC required (13 digits)";
    if (!form.businessReg.trim())
      newErrors.businessReg = "Business registration required";
    if (!form.documentUrl.trim())
      newErrors.documentUrl = "Document upload required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep("review");
  };

  const handleConfirm = () => {
    onSubmit?.(form);
    setStep("submitted");
    setTimeout(() => {
      setForm(INITIAL_FORM);
      setStep("form");
    }, 3000);
  };

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
      case "rejected":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      default:
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className={`p-2 rounded-lg ${getStatusColor(form.status)}`}
          >
            {getStatusIcon(form.status)}
          </motion.div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Seller Verification
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Complete your verification to unlock premium selling features
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.form
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="p-6 space-y-4"
          >
            {/* Personal Info */}
            <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Your full name"
                    disabled={isReadOnly}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="your.email@example.com"
                    disabled={isReadOnly}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 123-4567"
                    disabled={isReadOnly}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Government ID */}
            <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Government Identification
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  CNIC / ID Number *
                </label>
                <input
                  type="text"
                  value={form.cnic}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, cnic: e.target.value }))
                  }
                  placeholder="13 digit CNIC"
                  disabled={isReadOnly}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                />
                {errors.cnic && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.cnic}
                  </p>
                )}
              </div>
            </div>

            {/* Business Registration */}
            <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Business Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Business Registration Number *
                </label>
                <input
                  type="text"
                  value={form.businessReg}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      businessReg: e.target.value,
                    }))
                  }
                  placeholder="Registration number"
                  disabled={isReadOnly}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                />
                {errors.businessReg && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.businessReg}
                  </p>
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Supporting Document
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Document URL *
                </label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={form.documentUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        documentUrl: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/document.pdf"
                    disabled={isReadOnly}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 pl-10 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                  />
                </div>
                {errors.documentUrl && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.documentUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Action */}
            {!isReadOnly && (
              <div className="pt-6 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  Review & Submit
                </button>
              </div>
            )}
          </motion.form>
        )}

        {step === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-4"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Please review your information carefully. Admin will verify within 24 hours.
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(form).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                    {key}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate ml-4">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep("form")}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Confirm & Submit
              </button>
            </div>
          </motion.div>
        )}

        {step === "submitted" && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 text-center space-y-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Submitted Successfully
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your verification request has been submitted. Check your email for updates.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
