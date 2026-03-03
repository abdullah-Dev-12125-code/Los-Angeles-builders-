import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  Facebook,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { validateForm, validators } from "@/lib/form-validation";
import { UserRole, setStoredRole } from "@/lib/auth";
import { API_BASE, setTokens } from "@/lib/api";

type AuthMode = "login" | "signup";

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSellerRoute = location.pathname === "/seller-login";

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Extract<UserRole, "buyer" | "seller">>(
    isSellerRoute ? "seller" : "buyer"
  );
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedRole(isSellerRoute ? "seller" : "buyer");
  }, [isSellerRoute]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    let validationRules: any = {
      email: [validators.required("Email"), validators.email()],
      password: [
        validators.required("Password"),
        validators.minLength(6),
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
    setApiError(null);

    try {
      const endpoint = mode === "login" ? "/api/auth/login/" : "/api/auth/register/";
      
      let response;
      try {
        response = await fetch(`${API_BASE}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username: email.split("@")[0],
            password,
            ...(mode === "signup" && {
              first_name: name.split(" ")[0],
              last_name: name.split(" ").slice(1).join(" ") || "",
            }),
            role: selectedRole,
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
          || `${mode === "login" ? "Login" : "Registration"} failed. Please check your credentials.`;
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

      setTokens(data.access, data.refresh);
      setStoredRole(selectedRole);

      localStorage.setItem("userEmail", data.user?.email || email);
      localStorage.setItem("userName", data.user?.first_name || data.user?.username || name.split(" ")[0]);

      navigate(selectedRole === "seller" ? "/seller" : "/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setApiError(`${provider} login is not yet available. Please use email/password.`);
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
    <div className="relative min-h-screen overflow-hidden bg-gray-200">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gray-200/95" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-4 text-gray-700 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/welcome")}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="text-[11px] uppercase tracking-[0.25em] text-gray-600">Los Santos Realty</div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-8 sm:px-6">
          <div className="w-full max-w-md rounded-[28px] border border-yellow-200/60 bg-white/80 p-6 text-gray-900 shadow-xl backdrop-blur-sm sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100 text-2xl font-semibold text-gray-900">
                A
              </div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">
                {isSellerRoute ? "Seller Access" : "User Access"}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-900">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {mode === "login"
                  ? isSellerRoute
                    ? "Sign in to manage listings and leads"
                    : "Sign in to explore your personalized dashboard"
                  : "Create your account to continue"}
              </p>
            </div>

            {!isSellerRoute && (
              <div className="mb-5 inline-flex w-full rounded-full border border-yellow-200 bg-yellow-50/50 p-1">
                {[
                  { key: "buyer", label: "User" },
                  { key: "seller", label: "Seller" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedRole(item.key as "buyer" | "seller")}
                    className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      selectedRole === item.key
                        ? "bg-gradient-to-r from-yellow-300 to-yellow-200 text-gray-900 shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {apiError && (
                <div className="flex items-center gap-2 rounded-xl border border-yellow-300/60 bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{apiError}</p>
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`h-11 rounded-full border pl-10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-yellow-300 ${
                        errors.name
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-200 bg-white"
                      }`}
                    />
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.name && <p className="text-xs text-yellow-700">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-11 rounded-full border pl-10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-yellow-300 ${
                      errors.email
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 bg-white"
                    }`}
                  />
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.email && <p className="text-xs text-yellow-700">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-11 rounded-full border pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-yellow-300 ${
                      errors.password
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 bg-white"
                    }`}
                  />
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-yellow-700">{errors.password}</p>}
              </div>

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-11 rounded-full border pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-yellow-300 ${
                        errors.confirmPassword
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-200 bg-white"
                      }`}
                    />
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-yellow-700">{errors.confirmPassword}</p>}
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between pt-1 text-xs text-gray-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 bg-white text-yellow-400 focus:ring-yellow-300"
                    />
                    Remember me
                  </label>
                  <button type="button" className="hover:text-gray-900">
                    Need help?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-full py-3 text-sm font-semibold uppercase tracking-[0.25em] transition shadow-md ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-300 to-yellow-200 text-gray-900 hover:from-yellow-400 hover:to-yellow-300 hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait
                  </span>
                ) : mode === "login" ? (
                  "Get Started"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
              <div className="h-px flex-1 bg-gray-200" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Chrome className="h-4 w-4" /> Google
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("Facebook")}
                className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Facebook className="h-4 w-4" /> Facebook
                </span>
              </button>
            </div>

            <div className="mt-6 space-y-2 text-center text-xs">
              <p className="text-gray-600">
                {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-semibold text-yellow-700 hover:text-yellow-800"
                >
                  {mode === "login" ? "Create one" : "Sign in"}
                </button>
              </p>
              <p className="text-gray-600">
                {isSellerRoute ? "Looking for user login?" : "Seller access?"}{" "}
                <button
                  type="button"
                  onClick={() => navigate(isSellerRoute ? "/user-login" : "/seller-login")}
                  className="font-semibold text-yellow-700 hover:text-yellow-800"
                >
                  {isSellerRoute ? "Go to user login" : "Go to seller login"}
                </button>
              </p>
              <p className="text-gray-500">
                Admin?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/admin-login")}
                  className="font-semibold text-yellow-700 hover:text-yellow-800"
                >
                  Open admin portal
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
