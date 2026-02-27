import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeProvider } from "@/lib/dark-mode-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";

// Pages
import Welcome from "./pages/Welcome";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import RentTracking from "./pages/RentTracking";
import Analytics from "./pages/Analytics";
import PropertyDetail from "./pages/PropertyDetail";
import PaymentMethods from "./pages/PaymentMethods";
import Invoices from "./pages/Invoices";
import Notifications from "./pages/Notifications";
import Clients from "./pages/Clients";
import Deals from "./pages/Deals";
import UserDashboard from "./pages/UserDashboard";
import UserProperties from "./pages/UserProperties";
import UserPayments from "./pages/UserPayments";
import UserProfile from "./pages/UserProfile";
import UserSettings from "./pages/UserSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({
  element,
  requiredRole,
}: {
  element: React.ReactNode;
  requiredRole?: "admin" | "user";
}) => {
  const [userType, setUserType] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("userType");
    if (stored === "admin" || stored === "user") {
      setUserType(stored);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 text-blue-500 rounded-full border-4 border-gray-200 border-t-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userType) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requiredRole && userType !== requiredRole) {
    return (
      <Navigate
        to={userType === "admin" ? "/dashboard" : "/user-dashboard"}
        replace
      />
    );
  }

  return <>{element}</>;
};

// Root redirect component
const RootRedirect = () => {
  const userType = localStorage.getItem("userType");
  if (userType === "user") {
    return <Navigate to="/user-dashboard" replace />;
  } else if (userType === "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/welcome" replace />;
};

const App = () => (
  <ErrorBoundary>
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing */}
              <Route path="/welcome" element={<Welcome />} />

              {/* Auth Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/user-login" element={<UserLogin />} />

              {/* Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={<Dashboard />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/properties"
                element={
                  <ProtectedRoute
                    element={<Properties />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/properties/:propertyId"
                element={
                  <ProtectedRoute
                    element={<PropertyDetail />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/tenants"
                element={
                  <ProtectedRoute element={<Tenants />} requiredRole="admin" />
                }
              />
              <Route
                path="/rent-tracking"
                element={
                  <ProtectedRoute
                    element={<RentTracking />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute
                    element={<Analytics />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/payment-methods"
                element={
                  <ProtectedRoute
                    element={<PaymentMethods />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute element={<Invoices />} requiredRole="admin" />
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute
                    element={<Notifications />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute element={<Clients />} requiredRole="admin" />
                }
              />
              <Route
                path="/deals"
                element={
                  <ProtectedRoute element={<Deals />} requiredRole="admin" />
                }
              />

              {/* User Routes */}
              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute
                    element={<UserDashboard />}
                    requiredRole="user"
                  />
                }
              />
              <Route
                path="/user-profile"
                element={
                  <ProtectedRoute
                    element={<UserProfile />}
                    requiredRole="user"
                  />
                }
              />
              <Route
                path="/user-settings"
                element={
                  <ProtectedRoute
                    element={<UserSettings />}
                    requiredRole="user"
                  />
                }
              />
              <Route
                path="/user-properties"
                element={
                  <ProtectedRoute
                    element={<UserProperties />}
                    requiredRole="user"
                  />
                }
              />
              <Route
                path="/user-payments"
                element={
                  <ProtectedRoute
                    element={<UserPayments />}
                    requiredRole="user"
                  />
                }
              />

              {/* Root redirect */}
              <Route path="/" element={<RootRedirect />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </DarkModeProvider>
  </ErrorBoundary>
);

const container = document.getElementById("root");
if (container && !container._reactRoot) {
  const root = createRoot(container);
  (container as any)._reactRoot = root;
  root.render(<App />);
}
