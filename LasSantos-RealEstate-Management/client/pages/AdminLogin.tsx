import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { validateForm, validators } from "@/lib/form-validation";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm(
      { email, password },
      {
        email: [
          validators.required("Email"),
          validators.email(),
        ],
        password: [
          validators.required("Password"),
          validators.minLength(6),
        ],
      }
    );

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("userType", "admin");
      navigate("/dashboard");
      setLoading(false);
    }, 800);
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      {/* Hero section */}
      <div className="h-[300px] sm:h-[350px] lg:h-[400px] relative overflow-hidden bg-gradient-to-r from-gray-900 via-amber-900 to-gray-800">
        {/* Diagonal accent */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <polygon points="0,0 1200,0 1200,300 0,400" fill="currentColor" className="text-white" />
          </svg>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-start pl-4 sm:pl-8 lg:pl-16">
          <div className="max-w-2xl">
            {/* Back button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Admin Access
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-light max-w-md">
              Manage projects, teams, and operations across Los Angeles Builders
            </p>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <img
              src="/logo.png"
              alt="Los Angeles Builders"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Card */}
          <div className="bg-white rounded-[28px] border border-black/5 shadow-sm p-8 sm:p-10">
            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-[0.1em]">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className={`w-full px-4 py-3 bg-[#f7f5f2] border-2 rounded-lg transition-all focus:bg-white focus:outline-none ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#f7f5f2] focus:border-amber-500"
                  }`}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-3 uppercase tracking-[0.1em]">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError("password");
                    }}
                    className={`w-full px-4 py-3 bg-[#f7f5f2] border-2 rounded-lg transition-all focus:bg-white focus:outline-none pr-10 ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-[#f7f5f2] focus:border-amber-500"
                    }`}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-gray-300 accent-amber-500 cursor-pointer transition-colors"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-3 font-semibold uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2 transition-all rounded-full ${
                  loading
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Footer link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Not an admin?
              </p>
              <button
                onClick={() => navigate("/user-login")}
                className="w-full px-4 py-2 bg-gray-50 text-gray-900 font-semibold rounded-full border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                User Login
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500 font-light">
              © 2024 Los Angeles Builders. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
