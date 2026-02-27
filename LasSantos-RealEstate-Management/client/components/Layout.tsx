import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Home,
  Building2,
  Users,
  FileText,
  BarChart3,
  CreditCard,
  Bell,
  Handshake,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/lib/dark-mode-context";

interface LayoutProps {
  children: React.ReactNode;
  userType?: "admin" | "user";
}

const adminMenuItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard", requiredRole: "admin" },
  {
    href: "/properties",
    icon: Building2,
    label: "Properties",
    requiredRole: "admin",
  },
  { href: "/clients", icon: Users, label: "Clients", requiredRole: "admin" },
  { href: "/deals", icon: Handshake, label: "Deals", requiredRole: "admin" },
  { href: "/tenants", icon: Users, label: "Tenants", requiredRole: "admin" },
  {
    href: "/rent-tracking",
    icon: FileText,
    label: "Rent Tracking",
    requiredRole: "admin",
  },
  {
    href: "/invoices",
    icon: FileText,
    label: "Invoices",
    requiredRole: "admin",
  },
  {
    href: "/payment-methods",
    icon: CreditCard,
    label: "Payment Methods",
    requiredRole: "admin",
  },
  {
    href: "/notifications",
    icon: Bell,
    label: "Notifications",
    requiredRole: "admin",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    label: "Analytics",
    requiredRole: "admin",
  },
];

const userMenuItems = [
  {
    href: "/user-dashboard",
    icon: Home,
    label: "Dashboard",
    requiredRole: "user",
  },
  {
    href: "/user-properties",
    icon: Building2,
    label: "My Properties",
    requiredRole: "user",
  },
  {
    href: "/user-payments",
    icon: FileText,
    label: "Payments",
    requiredRole: "user",
  },
];

export default function Layout({ children, userType = "admin" }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const menuItems = userType === "admin" ? adminMenuItems : userMenuItems;

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    // Clear any auth data and redirect to welcome
    localStorage.removeItem("userType");
    window.location.href = "/welcome";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out z-40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to={userType === "admin" ? "/dashboard" : "/user-dashboard"}>
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F051c3d806a84458aa3b6d2a840d9a54d%2Febe722c15e9c44dea9e277bd4351ceb5?format=webp&width=100&height=100"
                alt="Los Santos Builders Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-sidebar-foreground">
                Los Santos
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <div className="text-sm font-medium text-foreground">
                Welcome, {userType === "admin" ? "Admin" : "User"}
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {userType === "admin" ? "A" : "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
