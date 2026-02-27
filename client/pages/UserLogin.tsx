import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  Chrome,
  Facebook,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { validateForm, validators } from "@/lib/form-validation";

type AuthMode = "login" | "signup";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const inputVariants = {
  focus: {
    scale: 1.01,
    transition: { duration: 0.2 },
  },
};

export default function UserLogin() {
  const navigate = useNavigate();

  // Auth state
  const [mode, setMode] = useState<AuthMode>("login");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let validationRules: any = {
      email: [validators.required("Email"), validators.email()],
      password: [
        validators.required("Password"),
        validators.minLength(6, "Password must be at least 6 characters"),
      ],
    };

    let dataToValidate: any = { email, password };

    if (mode === "signup") {
      validationRules.name = [validators.required("Full Name")];
      validationRules.confirmPassword = [
        validators.required("Confirm Password"),
      ];
      dataToValidate.name = name;
      dataToValidate.confirmPassword = confirmPassword;

      if (password !== confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match" });
        return;
      }
    }

    const validationErrors = validateForm(dataToValidate, validationRules);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("userType", "user");
      localStorage.setItem("userEmail", email);
      navigate("/user-dashboard");
      setLoading(false);
    }, 1200);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("userType", "user");
      navigate("/user-dashboard");
      setLoading(false);
    }, 1200);
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrors({});
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Animated background gradient orbs */}
      <motion.div
        className="fixed -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, -30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />


      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Hero image with overlay */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col justify-center items-start"
          >
            <div className="relative w-full h-[600px] rounded-3xl overflow-hidden group shadow-2xl">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80')",
                  backgroundPosition: "center",
                }}
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950 to-transparent" />

              {/* Content overlay */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="space-y-4">
                  <h2 className="text-5xl font-bold text-white tracking-tight">
                    {mode === "login" ? "Welcome Back" : "Build Your Future"}
                  </h2>
                  <p className="text-lg text-white/80 font-light max-w-md leading-relaxed">
                    {mode === "login"
                      ? "Access your premium real estate portfolio and manage properties effortlessly"
                      : "Join the most trusted real estate platform in Los Angeles"}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Premium login card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center items-center w-full"
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="w-full max-w-md"
            >
              {/* Card container */}
              <motion.div className="bg-white rounded-[32px] border border-gray-200/80 shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 sm:p-10">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8 text-center">
                  {/* Back button */}
                  <motion.button
                    onClick={() => navigate("/")}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-semibold uppercase tracking-widest mb-4 transition-colors ml-0 hover:ml-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back
                  </motion.button>

                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {mode === "login"
                      ? "Access your Los Santos dashboard"
                      : "Get started with premium features"}
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleAuth} className="space-y-5">
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {/* Name field - signup only */}
                    {mode === "signup" && (
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                          Full Name
                        </label>
                        <motion.div
                          variants={inputVariants}
                          whileFocus="focus"
                          className="relative"
                        >
                          <Input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full px-4 py-3 pl-10 bg-gray-50 border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                              errors.name
                                ? "border-red-300 focus:border-red-500 focus:bg-red-50/30"
                                : "border-gray-200 focus:border-amber-500 focus:bg-white"
                            }`}
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </motion.div>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-600 font-medium"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </motion.div>
                    )}

                    {/* Email field */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                        Email Address
                      </label>
                      <motion.div
                        variants={inputVariants}
                        whileFocus="focus"
                        className="relative"
                      >
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-4 py-3 pl-10 bg-gray-50 border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                            errors.email
                              ? "border-red-300 focus:border-red-500 focus:bg-red-50/30"
                              : "border-gray-200 focus:border-amber-500 focus:bg-white"
                          }`}
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </motion.div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600 font-medium"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password field */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                        Password
                      </label>
                      <motion.div
                        variants={inputVariants}
                        whileFocus="focus"
                        className="relative"
                      >
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-4 py-3 pl-10 pr-10 bg-gray-50 border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                            errors.password
                              ? "border-red-300 focus:border-red-500 focus:bg-red-50/30"
                              : "border-gray-200 focus:border-amber-500 focus:bg-white"
                          }`}
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </motion.button>
                      </motion.div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600 font-medium"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Confirm Password - signup only */}
                    {mode === "signup" && (
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900">
                          Confirm Password
                        </label>
                        <motion.div
                          variants={inputVariants}
                          whileFocus="focus"
                          className="relative"
                        >
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-3 pl-10 pr-10 bg-gray-50 border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                              errors.confirmPassword
                                ? "border-red-300 focus:border-red-500 focus:bg-red-50/30"
                                : "border-gray-200 focus:border-amber-500 focus:bg-white"
                            }`}
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <motion.button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </motion.button>
                        </motion.div>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-600 font-medium"
                          >
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Remember me & Forgot password - login only */}
                  {mode === "login" && (
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-between pt-1"
                    >
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border border-gray-300 accent-amber-500 cursor-pointer transition-all"
                        />
                        <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                          Remember me
                        </span>
                      </label>
                      <motion.button
                        type="button"
                        whileHover={{ color: "#b45309" }}
                        className="text-xs font-semibold text-amber-600 transition-colors"
                      >
                        Forgot password?
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Terms - signup only */}
                  {mode === "signup" && (
                    <motion.label
                      variants={itemVariants}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border border-gray-300 accent-amber-500 cursor-pointer transition-all mt-0.5 flex-shrink-0"
                        defaultChecked
                      />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors font-medium leading-relaxed">
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-amber-600 hover:text-amber-700 underline font-semibold transition-colors"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="text-amber-600 hover:text-amber-700 underline font-semibold transition-colors"
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </motion.label>
                  )}

                  {/* Submit button */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      variants={buttonVariants}
                      whileHover={!loading ? "hover" : undefined}
                      whileTap={!loading ? "tap" : undefined}
                      className={`w-full py-3 font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 rounded-xl uppercase tracking-widest ${
                        loading
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-4 h-4" />
                          </motion.div>
                          {mode === "login" ? "Signing in..." : "Creating account..."}
                        </>
                      ) : (
                        <>
                          {mode === "login" ? "Sign In" : "Create Account"}
                          <motion.div whileHover={{ x: 4 }}>
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500 font-medium">
                      {mode === "login" ? "Or continue with" : "Or sign up with"}
                    </span>
                  </div>
                </motion.div>

                {/* Social login buttons */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-3"
                >
                  <motion.button
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={loading}
                    variants={itemVariants}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Chrome className="w-4 h-4 text-gray-700" />
                    <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Google</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => handleSocialLogin("Facebook")}
                    disabled={loading}
                    variants={itemVariants}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Facebook className="w-4 h-4 text-gray-700" />
                    <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Facebook</span>
                  </motion.button>
                </motion.div>

                {/* Toggle mode */}
                <motion.div variants={itemVariants} className="pt-6 border-t border-gray-100 mt-6 text-center">
                  <p className="text-xs text-gray-600 mb-3">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  </p>
                  <motion.button
                    type="button"
                    onClick={toggleMode}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 text-sm"
                  >
                    {mode === "login" ? "Create Account" : "Sign In"}
                  </motion.button>
                </motion.div>

                {/* Admin link */}
                <motion.div variants={itemVariants} className="text-center pt-4">
                  <p className="text-xs text-gray-500">
                    Admin?{" "}
                    <motion.button
                      type="button"
                      onClick={() => navigate("/admin-login")}
                      whileHover={{ color: "#b45309" }}
                      className="text-amber-600 font-semibold transition-colors"
                    >
                      Admin Portal
                    </motion.button>
                  </p>
                </motion.div>
              </motion.div>

              {/* Footer */}
              <motion.div
                variants={itemVariants}
                className="text-center mt-6"
              >
                <p className="text-xs text-gray-500 font-light">
                  © 2024 Los Santos Real Estate. All rights reserved.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
