import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Bell,
  Moon,
  Globe,
  Shield,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

export default function UserSettings() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [settings, setSettings] = useState({
    // Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    newListings: true,
    priceDrops: true,
    savedSearches: false,

    // Privacy
    profilePublic: true,
    showEmail: false,
    showPhone: false,

    // Preferences
    darkMode: false,
    language: "en",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);

    // Save to localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const ToggleSwitch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => (
    <motion.button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-gray-300"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        layout
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </motion.button>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/20"
    >
      {/* Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/user-dashboard")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-sm text-gray-600">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Change Password
                </h3>
                <p className="text-sm text-gray-600">
                  Update your password regularly for security
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={settings.newPassword}
                    onChange={(e) =>
                      setSettings({ ...settings, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) =>
                    setSettings({ ...settings, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Manage how we communicate with you
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive updates via email
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.emailNotifications}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      emailNotifications: !settings.emailNotifications,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">
                    SMS Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive text messages
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.smsNotifications}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      smsNotifications: !settings.smsNotifications,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">New Listings</p>
                  <p className="text-sm text-gray-600">
                    Get notified about new properties
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.newListings}
                  onChange={() =>
                    setSettings({ ...settings, newListings: !settings.newListings })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">Price Drops</p>
                  <p className="text-sm text-gray-600">
                    Alerts when prices decrease
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.priceDrops}
                  onChange={() =>
                    setSettings({ ...settings, priceDrops: !settings.priceDrops })
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Privacy & Security
                </h3>
                <p className="text-sm text-gray-600">
                  Control your privacy settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">Public Profile</p>
                  <p className="text-sm text-gray-600">
                    Make your profile visible to others
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.profilePublic}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      profilePublic: !settings.profilePublic,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">Show Email</p>
                  <p className="text-sm text-gray-600">
                    Display email on public profile
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.showEmail}
                  onChange={() =>
                    setSettings({ ...settings, showEmail: !settings.showEmail })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">Show Phone</p>
                  <p className="text-sm text-gray-600">
                    Display phone number on profile
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.showPhone}
                  onChange={() =>
                    setSettings({ ...settings, showPhone: !settings.showPhone })
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Preferences</h3>
                <p className="text-sm text-gray-600">
                  Customize your experience
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">
                    Switch to dark theme
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.darkMode}
                  onChange={() =>
                    setSettings({ ...settings, darkMode: !settings.darkMode })
                  }
                />
              </div>

              <div className="py-3">
                <label className="block font-semibold text-gray-900 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSaving}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save All Changes
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
