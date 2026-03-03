import { ReactNode, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";

type NavItem = {
  label: string;
  to: string;
};

interface PremiumShellProps {
  userName: string;
  userEmail: string;
  userImage?: string;
  navItems: NavItem[];
  children: ReactNode;
}

export default function PremiumShell({
  userName,
  userEmail,
  userImage,
  navItems,
  children,
}: PremiumShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-yellow-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link to="/welcome" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100 text-sm font-bold text-slate-900">
              LS
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Los Santos Realty</p>
              <p className="text-xs text-slate-500">Premium Property Platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-yellow-100 text-slate-900"
                      : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <ProfileDropdown userName={userName} userEmail={userEmail} userImage={userImage} />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg border border-gray-200 p-2 text-slate-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-yellow-100 text-slate-900"
                        : "text-slate-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 border-t border-gray-200 pt-3">
              <ProfileDropdown userName={userName} userEmail={userEmail} userImage={userImage} />
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="mt-10 border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 text-gray-200">
        <div className="mx-auto grid w-full max-w-screen-2xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-200">Company</h3>
            <p className="mt-3 text-sm text-gray-300">
              Los Santos Realty helps buyers and sellers manage premium properties with confidence.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-200">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              {navItems.slice(0, 4).map((item) => (
                <li key={`footer-${item.to}`}>
                  <Link to={item.to} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-200">Contact</h3>
            <p className="mt-3 text-sm text-gray-300">support@lossantosrealty.com</p>
            <p className="mt-1 text-sm text-gray-300">+1 (555) 010-9000</p>
            <p className="mt-1 text-sm text-gray-300">Los Santos, CA</p>
          </section>
        </div>

        <div className="border-t border-gray-700 px-4 py-4 text-center text-xs text-gray-400 md:px-6">
          © {new Date().getFullYear()} Los Santos Realty. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
