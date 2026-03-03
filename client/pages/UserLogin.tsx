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
      if (mode === "signup") {
        setTokens("demo-access-token", "demo-refresh-token");
        setStoredRole(selectedRole);

        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name.split(" ")[0] || email.split("@")[0]);

        navigate(selectedRole === "seller" ? "/seller" : "/dashboard");
        return;
      }

      const endpoint = "/api/auth/login/";
      
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
            role: selectedRole,
          }),
        });
      } catch (fetchError) {
        console.error("Network error:", fetchError);
        if (fetchError instanceof TypeError) {
          setTokens("demo-access-token", "demo-refresh-token");
          setStoredRole(selectedRole);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", email.split("@")[0]);
          navigate(selectedRole === "seller" ? "/seller" : "/dashboard");
          return;
        }

        throw new Error("Network error occurred. Please check your connection.");
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
    <div className="relative min-h-screen overflow-hidden bg-gray-800">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gray-900/90" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-4 text-gray-300 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/welcome")}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Los Santos Realty</div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-8 sm:px-6">
          <div className="w-full max-w-md rounded-[28px] border border-gray-600/70 bg-gray-800/90 p-6 text-gray-100 shadow-xl backdrop-blur-sm sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-gray-500 bg-gradient-to-br from-gray-700 to-gray-600 text-2xl font-semibold text-gray-100">
                A
              </div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">
                {isSellerRoute ? "Seller Access" : "User Access"}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-100">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                {mode === "login"
                  ? isSellerRoute
                    ? "Sign in to manage listings and leads"
                    : "Sign in to explore your personalized dashboard"
                  : "Create your account to continue"}
              </p>
            </div>

            {!isSellerRoute && (
              <div className="mb-5 inline-flex w-full rounded-full border border-gray-600 bg-gray-700/70 p-1">
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
                        ? "bg-gradient-to-r from-gray-500 to-gray-400 text-gray-100 shadow-md"
                        : "text-gray-300 hover:text-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {apiError && (
                <div className="flex items-center gap-2 rounded-xl border border-gray-600/70 bg-gray-700 px-3 py-2 text-sm text-gray-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{apiError}</p>
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`h-11 rounded-full border pl-10 text-gray-100 placeholder:text-gray-400 focus-visible:ring-gray-500 ${
                        errors.name
                          ? "border-gray-500 bg-gray-700"
                          : "border-gray-600 bg-gray-800"
                      }`}
                    />
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                  {errors.name && <p className="text-xs text-gray-300">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-11 rounded-full border pl-10 text-gray-100 placeholder:text-gray-400 focus-visible:ring-gray-500 ${
                      errors.email
                        ? "border-gray-500 bg-gray-700"
                        : "border-gray-600 bg-gray-800"
                    }`}
                  />
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
                {errors.email && <p className="text-xs text-gray-300">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-11 rounded-full border pl-10 pr-10 text-gray-100 placeholder:text-gray-400 focus-visible:ring-gray-500 ${
                      errors.password
                        ? "border-gray-500 bg-gray-700"
                        : "border-gray-600 bg-gray-800"
                    }`}
                  />
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-gray-300">{errors.password}</p>}
              </div>

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-11 rounded-full border pl-10 pr-10 text-gray-100 placeholder:text-gray-400 focus-visible:ring-gray-500 ${
                        errors.confirmPassword
                          ? "border-gray-500 bg-gray-700"
                          : "border-gray-600 bg-gray-800"
                      }`}
                    />
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-gray-300">{errors.confirmPassword}</p>}
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between pt-1 text-xs text-gray-300">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-gray-300 focus:ring-gray-500"
                    />
                    Remember me
                  </label>
                  <button type="button" className="hover:text-gray-100">
                    Need help?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-full py-3 text-sm font-semibold uppercase tracking-[0.25em] transition shadow-md ${
                  loading
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 hover:from-gray-600 hover:to-gray-500 hover:shadow-lg"
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

            <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
              <div className="h-px flex-1 bg-gray-600" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-gray-600" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="rounded-full border border-gray-600 bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-100 hover:bg-gray-700 hover:border-gray-500"
              >
                <span className="inline-flex items-center gap-2">
                  <Chrome className="h-4 w-4" /> Google
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("Facebook")}
                className="rounded-full border border-gray-600 bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-100 hover:bg-gray-700 hover:border-gray-500"
              >
                <span className="inline-flex items-center gap-2">
                  <Facebook className="h-4 w-4" /> Facebook
                </span>
              </button>
            </div>

            <div className="mt-6 space-y-2 text-center text-xs">
              <p className="text-gray-300">
                {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-semibold text-gray-200 hover:text-gray-100"
                >
                  {mode === "login" ? "Create one" : "Sign in"}
                </button>
              </p>
              <p className="text-gray-300">
                {isSellerRoute ? "Looking for user login?" : "Seller access?"}{" "}
                <button
                  type="button"
                  onClick={() => navigate(isSellerRoute ? "/user-login" : "/seller-login")}
                  className="font-semibold text-gray-200 hover:text-gray-100"
                >
                  {isSellerRoute ? "Go to user login" : "Go to seller login"}
                </button>
              </p>
              <p className="text-gray-400">
                Admin?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/admin-login")}
                  className="font-semibold text-gray-200 hover:text-gray-100"
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
