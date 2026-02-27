import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Settings, Heart, LogOut, ChevronDown } from "lucide-react";

interface ProfileDropdownProps {
  userName: string;
  userEmail: string;
  userImage?: string;
}

export default function ProfileDropdown({
  userName,
  userEmail,
  userImage,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/user-login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all group"
      >
        {/* Avatar */}
        <div className="relative">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 group-hover:border-amber-500 transition-colors"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold border-2 border-gray-200 group-hover:border-amber-500 transition-colors">
              {getInitials(userName)}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {/* Name (Hidden on mobile) */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900">{userName}</p>
          <p className="text-xs text-gray-600">{userEmail.split("@")[0]}</p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform hidden md:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100">
              <div className="flex items-center gap-3">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-lg font-bold border-2 border-amber-300">
                    {getInitials(userName)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-600">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <motion.button
                whileHover={{ backgroundColor: "rgb(255 251 235)", x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate("/user-profile");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    View Profile
                  </p>
                  <p className="text-xs text-gray-600">
                    Manage your account
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "rgb(255 251 235)", x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate("/user-settings");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Settings</p>
                  <p className="text-xs text-gray-600">
                    Preferences & privacy
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "rgb(255 251 235)", x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Scroll to favorites section or filter
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    My Favorites
                  </p>
                  <p className="text-xs text-gray-600">Saved properties</p>
                </div>
              </motion.button>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100">
              <motion.button
                whileHover={{ backgroundColor: "rgb(254 242 242)", x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full px-4 py-3 flex items-center gap-3 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-600">Logout</p>
                  <p className="text-xs text-gray-600">Sign out of account</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
