import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeProvider } from "@/lib/dark-mode-context";
import { UserProvider } from "@/lib/user-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";
import { UserRole, getStoredRole } from "@/lib/auth";

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
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import PropertyCommandCenter from "./pages/PropertyCommandCenter";
import SellerVerification from "./pages/SellerVerification";
import SellerDashboardPro from "./pages/SellerDashboardPro";
import BuyerDashboardPro from "./pages/BuyerDashboardPro";
import UserAccountDashboard from "./pages/UserAccountDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({
  element,
  requiredRole,
}: {
  element: React.ReactNode;
  requiredRole?: UserRole;
}) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredRole();
    setUserRole(stored);
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

  if (!userRole) {
    return <Navigate to="/welcome" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

// Root redirect component
const RootRedirect = () => {
  const role = getStoredRole();
  if (role === "buyer") {
    return <Navigate to="/dashboard" replace />;
  }
  if (role === "seller") {
    return <Navigate to="/seller" replace />;
  }
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/welcome" replace />;
};

const App = () => (
  <ErrorBoundary>
    <DarkModeProvider>
      <UserProvider>
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
              <Route path="/seller-login" element={<UserLogin />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    element={<AdminDashboard />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/seller"
                element={
                  <ProtectedRoute
                    element={<SellerDashboard />}
                    requiredRole="seller"
                  />
                }
              />
              <Route
                path="/seller-pro"
                element={
                  <ProtectedRoute
                    element={<SellerDashboardPro />}
                    requiredRole="seller"
                  />
                }
              />
              <Route
                path="/seller-verification"
                element={
                  <ProtectedRoute
                    element={<SellerVerification />}
                    requiredRole="seller"
                  />
                }
              />
              <Route
                path="/command-center"
                element={
                  <ProtectedRoute
                    element={<PropertyCommandCenter />}
                    requiredRole="seller"
                  />
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={<BuyerDashboard />}
                    requiredRole="buyer"
                  />
                }
              />
              <Route
                path="/buyer-pro"
                element={
                  <ProtectedRoute
                    element={<BuyerDashboardPro />}
                    requiredRole="buyer"
                  />
                }
              />
              <Route
                path="/buyer-dashboard"
                element={
                  <ProtectedRoute
                    element={<BuyerDashboard />}
                    requiredRole="buyer"
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
                    requiredRole="buyer"
                  />
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute
                    element={<UserAccountDashboard />}
                    requiredRole="buyer"
                  />
                }
              />
              <Route
                path="/user-profile"
                element={
                  <ProtectedRoute
                    element={<UserProfile />}
                    requiredRole="buyer"
                  />
                }
              />
              <Route
                path="/user-settings"
                element={
                  <ProtectedRoute
                    element={<UserSettings />}
                    requiredRole="buyer"
                  />
                }
              />
              <Route
                path="/user-properties"
                element={
                  <ProtectedRoute
                    element={<UserProperties />}
                    requiredRole="buyer"
                  />
                }
              />
              <Route
                path="/user-payments"
                element={
                  <ProtectedRoute
                    element={<UserPayments />}
                    requiredRole="buyer"
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
      </UserProvider>
    </DarkModeProvider>
  </ErrorBoundary>
);
const container = document.getElementById("root");

if (container && !container._reactRoot) {
  const root = createRoot(container);
  (container as any)._reactRoot = root;
  root.render(<App />);
}
