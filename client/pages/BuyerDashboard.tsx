import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PanelRightOpen, PanelRightClose, Bell, Receipt, FileText } from "lucide-react";
import { useUserContext } from "@/lib/user-context";
import PremiumShell from "@/components/PremiumShell";
import PropertyGridSystem from "@/components/PropertyGridSystem";
import { getProperties, Property } from "@/lib/property-system";
import { getMessagesForSeller, isSellerAvailableOnline } from "@/lib/seller-communication";

type BuyerPreferences = {
  minBudget: string;
  maxBudget: string;
  location: string;
  propertyType: "all" | Property["type"];
  bedrooms: string;
  renting: boolean;
  requirements: string;
};

const DEFAULT_PREFERENCES: BuyerPreferences = {
  minBudget: "",
  maxBudget: "",
  location: "",
  propertyType: "all",
  bedrooms: "",
  renting: false,
  requirements: "",
};

const PREFERENCES_KEY = "buyerDashboardPreferences";

const BUYER_NAV_ITEMS = [
  { label: "Browse", to: "/dashboard" },
  { label: "My Properties", to: "/user-properties" },
  { label: "Payments", to: "/user-payments" },
  { label: "Profile", to: "/user-profile" },
];

export default function BuyerDashboard() {
  const { userProfile } = useUserContext();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [connectMessage, setConnectMessage] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<BuyerPreferences>(() => {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return DEFAULT_PREFERENCES;

    try {
      return { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<BuyerPreferences>) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const properties = useMemo(
    () => getProperties().filter((property) => property.status === "active"),
    [],
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (preferences.minBudget && property.price < Number(preferences.minBudget)) return false;
      if (preferences.maxBudget && property.price > Number(preferences.maxBudget)) return false;
      if (preferences.location && !property.location.toLowerCase().includes(preferences.location.toLowerCase())) return false;
      if (preferences.propertyType !== "all" && property.type !== preferences.propertyType) return false;
      if (preferences.bedrooms && property.bedrooms < Number(preferences.bedrooms)) return false;
      return true;
    });
  }, [properties, preferences]);

  const sellerMessages = useMemo(
    () => properties.flatMap((property) => getMessagesForSeller(property.sellerId)).slice(0, 12),
    [properties],
  );

  const buyerWarnings = sellerMessages.filter((message) => message.type === "warning" || message.type === "notification");
  const buyerTaxes = sellerMessages.filter((message) => message.type === "tax");
  const buyerRentBills = sellerMessages.filter((message) => message.type === "rent");

  const persistPreferences = useCallback((next: BuyerPreferences) => {
    setPreferences(next);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }, []);

  const handleConnect = useCallback((property: Property) => {
    setConnectMessage(`Online request sent for ${property.title}. Seller will respond in app notifications.`);
    setTimeout(() => setConnectMessage(null), 3500);
  }, []);

  return (
    <PremiumShell
      userName={userProfile.name}
      userEmail={userProfile.email}
      userImage={userProfile.profileImage}
      navItems={BUYER_NAV_ITEMS}
    >
      <section className="mx-auto w-full max-w-screen-2xl px-4 pt-6 md:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Buyer Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Welcome back, {userProfile.name.split(" ")[0]}. Explore listings, compare options, and connect with sellers.
          </p>
        </div>
      </section>

      <div className="relative mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-12 md:px-6">
        <aside className="md:col-span-3 space-y-4">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Buyer Records</h2>
            <p className="mt-2 text-xs text-slate-600">Saved Properties: {favorites.size}</p>
            <p className="mt-1 text-xs text-slate-600">Active Matches: {filteredProperties.length}</p>
            <p className="mt-1 text-xs text-slate-600">Preferences: {preferences.requirements ? "Configured" : "Not set"}</p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FileText className="h-4 w-4 text-yellow-600" /> Buyer Taxes
            </h2>
            {buyerTaxes.length > 0 ? (
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                {buyerTaxes.slice(0, 3).map((tax) => (
                  <li key={tax.id} className="rounded-lg bg-slate-50 p-2">{tax.title}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-500">No tax notes available.</p>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Receipt className="h-4 w-4 text-yellow-600" /> Buyer Rent
            </h2>
            {!preferences.renting ? (
              <p className="mt-2 text-xs text-slate-500">Enable renting in Preferences to receive rent bills.</p>
            ) : buyerRentBills.length > 0 ? (
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                {buyerRentBills.slice(0, 3).map((bill) => (
                  <li key={bill.id} className="rounded-lg bg-slate-50 p-2">
                    {bill.title}
                    {typeof bill.amount === "number" ? ` · $${bill.amount.toLocaleString()}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-500">No rent bills yet.</p>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Bell className="h-4 w-4 text-yellow-600" /> Alerts & Notifications
            </h2>
            {buyerWarnings.length > 0 ? (
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                {buyerWarnings.slice(0, 3).map((note) => (
                  <li key={note.id} className="rounded-lg bg-slate-50 p-2">{note.title}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-slate-500">No alerts yet.</p>
            )}
          </section>
        </aside>

        <main className="md:col-span-9">
          {connectMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              {connectMessage}
            </motion.div>
          )}

          {filteredProperties.length > 0 ? (
            <PropertyGridSystem
              properties={filteredProperties}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              showConnectAction
              canConnectOnline={(property) => isSellerAvailableOnline(property.sellerId)}
              onConnectOnline={handleConnect}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm">
              No properties match your preferences right now.
            </div>
          )}
        </main>
      </div>

      <button
        onClick={() => setPreferencesOpen((prev) => !prev)}
        className="fixed right-0 top-1/2 z-40 -translate-y-1/2 rounded-l-xl border border-r-0 border-yellow-200 bg-yellow-100 px-3 py-3 text-slate-900 shadow-sm transition hover:bg-yellow-200"
        aria-label="Toggle preferences panel"
      >
        {preferencesOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
      </button>

      <aside
        className={`fixed right-0 top-0 z-40 h-full w-[320px] border-l border-slate-200 bg-white p-5 shadow-xl transition-transform duration-300 ${
          preferencesOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
        <p className="mt-1 text-xs text-slate-600">Set your requirements for better property matches.</p>

        <div className="mt-4 space-y-3">
          <input
            value={preferences.location}
            onChange={(e) => persistPreferences({ ...preferences, location: e.target.value })}
            placeholder="Preferred location"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-400"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={preferences.minBudget}
              onChange={(e) => persistPreferences({ ...preferences, minBudget: e.target.value })}
              placeholder="Min budget"
              type="number"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-400"
            />
            <input
              value={preferences.maxBudget}
              onChange={(e) => persistPreferences({ ...preferences, maxBudget: e.target.value })}
              placeholder="Max budget"
              type="number"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-400"
            />
          </div>

          <select
            value={preferences.propertyType}
            onChange={(e) => persistPreferences({ ...preferences, propertyType: e.target.value as BuyerPreferences["propertyType"] })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-400"
          >
            <option value="all">All property types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="construction">Construction</option>
            <option value="luxury">Luxury</option>
          </select>

          <input
            value={preferences.bedrooms}
            onChange={(e) => persistPreferences({ ...preferences, bedrooms: e.target.value })}
            placeholder="Minimum bedrooms"
            type="number"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-400"
          />

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={preferences.renting}
              onChange={(e) => persistPreferences({ ...preferences, renting: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500"
            />
            I am currently looking for rental options
          </label>

          <textarea
            value={preferences.requirements}
            onChange={(e) => persistPreferences({ ...preferences, requirements: e.target.value })}
            placeholder="Other requirements"
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-400"
          />
        </div>
      </aside>
    </PremiumShell>
  );
}
