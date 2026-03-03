import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, Loader2, Building2, Chrome, Facebook } from "lucide-react";
import { validateForm, validators } from "@/lib/form-validation";
import { setStoredRole } from "@/lib/auth";
import { fetchJson, setTokens, API_BASE } from "@/lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("password");
  const [securityKey, setSecurityKey] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Find your sweet home",
      subtitle: "Schedule visit in just a few clicks",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
    },
    {
      title: "Manage Properties Effortlessly",
      subtitle: "Complete control at your fingertips",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
    },
    {
      title: "Track Everything Real-Time",
      subtitle: "Stay updated with instant notifications",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const validationErrors = validateForm(
      { email, password, username, securityKey, idNumber },
      {
        email: [
          validators.required("Email"),
          validators.email(),
        ],
        password: [
          validators.required("Password"),
          validators.minLength(6),
        ],
        username: [validators.required("Username")],
        securityKey: [validators.required("Security Key")],
        idNumber: [validators.required("ID Number")],
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
  setApiError(null);

    try {
      // Call backend API for admin login
      let response;
      try {
        response = await fetch(`${API_BASE}/api/auth/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role: "admin",
            username,
            security_key: securityKey,
            id_number: idNumber,
          }),
        });
      } catch (fetchError) {
        console.error("Network error:", fetchError);
        const errorMsg = fetchError instanceof TypeError 
          ? `Cannot connect to backend server at ${API_BASE}.\n\nPlease ensure:\n• Django server is running: python manage.py runserver 8000\n• Check BACKEND_SETUP.md for setup instructions`
          : "Network error occurred. Please check your connection.";
        throw new Error(errorMsg);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error 
          || errorData.detail 
          || errorData.message 
          || "Login failed. Please check your credentials.";
        setApiError(errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.access || !data.refresh) {
        setApiError("Invalid response from server. Please try again.");
        setLoading(false);
        return;
      }

      // Store tokens and role
      setTokens(data.access, data.refresh);
      setStoredRole("admin");
      
      // Store user info
      localStorage.setItem("userEmail", data.user?.email || email);
      localStorage.setItem("userName", data.user?.first_name || data.user?.username || username);

      // Redirect to admin dashboard
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero Image with Carousel */}
      <div className="hidden lg:block relative bg-gradient-to-br from-yellow-50 via-white to-yellow-100 overflow-hidden">
        {/* Image Slider */}
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-80"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/60 via-yellow-800/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-gray-900" />
          </div>
          <span className="text-2xl font-bold text-white drop-shadow-lg">Los Santos</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-12 z-10 text-white">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">{slides[currentSlide].title}</h1>
          <p className="text-xl mb-8 text-white/95 drop-shadow-md">{slides[currentSlide].subtitle}</p>
          
          {/* Carousel Dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "w-8 bg-yellow-300" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col bg-gradient-to-br from-white via-yellow-50/30 to-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-xl font-bold text-gray-900">Los Santos</span>
          </div>
          <div className="ml-auto">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 shadow-none"
            >
              Sign in
            </Button>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back to Los Santos!</h1>
              <p className="text-gray-600">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* API Error */}
              {apiError && (
                <div className="flex items-center gap-3 px-4 py-3 bg-yellow-50 border border-yellow-300/60 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">{apiError}</p>
                </div>
              )}

              {/* Your Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
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
                  className={`w-full px-4 py-3 border rounded-xl transition-all ${
                    errors.email
                      ? "border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                      : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-yellow-700">{errors.email}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearError("username");
                  }}
                  className={`w-full px-4 py-3 border rounded-xl transition-all ${
                    errors.username
                      ? "border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                      : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-yellow-700">{errors.username}</p>
                )}
              </div>

              {/* ID Number */}
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  ID Number
                </label>
                <Input
                  id="idNumber"
                  type="text"
                  placeholder="Enter your ID number"
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                    clearError("idNumber");
                  }}
                  className={`w-full px-4 py-3 border rounded-xl transition-all ${
                    errors.idNumber
                      ? "border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                      : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  }`}
                />
                {errors.idNumber && (
                  <p className="mt-1 text-sm text-yellow-700">{errors.idNumber}</p>
                )}
              </div>

              {/* Security Key */}
              <div>
                <label htmlFor="securityKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Security Key
                </label>
                <Input
                  id="securityKey"
                  type="password"
                  placeholder="Enter your security key"
                  value={securityKey}
                  onChange={(e) => {
                    setSecurityKey(e.target.value);
                    clearError("securityKey");
                  }}
                  className={`w-full px-4 py-3 border rounded-xl transition-all ${
                    errors.securityKey
                      ? "border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                      : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  }`}
                />
                {errors.securityKey && (
                  <p className="mt-1 text-sm text-yellow-700">{errors.securityKey}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`w-full px-4 py-3 border rounded-xl pr-10 transition-all ${
                      errors.password
                        ? "border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                        : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-yellow-700">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-300"
                  />
                  <span className="text-sm text-gray-700">Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                variant="ghost"
                className="w-full py-3 bg-gradient-to-r from-yellow-300 to-yellow-200 hover:from-yellow-400 hover:to-yellow-300 text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Instant Login */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Instant Login</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl"
                  >
                    <Chrome className="w-5 h-5 text-gray-700" />
                    <span className="text-sm text-gray-700">Continue with Google</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Continue with Facebook</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have any account?{" "}
                <button
                  onClick={() => navigate("/user-login")}
                  className="text-yellow-700 hover:text-yellow-800 font-semibold"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
