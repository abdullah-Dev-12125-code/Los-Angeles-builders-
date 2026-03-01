import { ChangeEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Save, UploadCloud } from "lucide-react";
import { useDarkMode } from "@/lib/dark-mode-context";
import { useUserContext } from "@/lib/user-context";

type PersistedSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  profilePublic: boolean;
  darkMode: boolean;
  language: string;
};

const settingsKey = "userSettings";

const initialSettings: PersistedSettings = {
  emailNotifications: true,
  smsNotifications: false,
  profilePublic: true,
  darkMode: false,
  language: "en",
};

export default function UserSettings() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { userProfile, updateUserProfile, logout } = useUserContext();

  const [settings, setSettings] = useState<PersistedSettings>(initialSettings);
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [location, setLocation] = useState(userProfile.location);
  const [bio, setBio] = useState(userProfile.bio);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const persisted = localStorage.getItem(settingsKey);
    if (persisted) {
      const parsed = JSON.parse(persisted) as PersistedSettings;
      setSettings(parsed);
      if (parsed.darkMode !== isDarkMode) {
        toggleDarkMode();
      }
    }
  }, []);

  const handleProfileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateUserProfile({ profileImage: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const toggleSetting = (key: keyof PersistedSettings) => {
    if (key === "darkMode") {
      toggleDarkMode();
    }
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveAll = async () => {
    setSaving(true);

    const payload: PersistedSettings = { ...settings, darkMode: isDarkMode };
    updateUserProfile({ name, phone, location, bio });
    localStorage.setItem(settingsKey, JSON.stringify(payload));

    await new Promise((resolve) => setTimeout(resolve, 550));
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/welcome", { replace: true });
  };

  const rowClass = `flex items-center justify-between py-3 border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <header className={`sticky top-0 z-30 backdrop-blur border-b ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg border border-slate-300/40">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Settings</h1>
              <p className="text-xs text-slate-500">Profile, preferences, and security controls</p>
            </div>
          </div>

          <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm inline-flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl border p-5 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="grid md:grid-cols-[120px_1fr] gap-4 items-start">
            <div className="space-y-2">
              <img
                src={userProfile.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80"}
                alt="Profile"
                className="w-24 h-24 rounded-xl object-cover border border-slate-300/40"
              />
              <label className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300/40 cursor-pointer">
                <UploadCloud className="w-3.5 h-3.5" />Upload
                <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="px-3 py-2 rounded-lg border border-slate-300 bg-transparent" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" className="px-3 py-2 rounded-lg border border-slate-300 bg-transparent" />
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" className="px-3 py-2 rounded-lg border border-slate-300 bg-transparent sm:col-span-2" />
              <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bio" rows={3} className="px-3 py-2 rounded-lg border border-slate-300 bg-transparent sm:col-span-2" />
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`rounded-xl border p-5 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <h2 className="font-semibold mb-2">Preferences & Toggles</h2>
          <div className={rowClass}>
            <span>Email notifications</span>
            <input type="checkbox" checked={settings.emailNotifications} onChange={() => toggleSetting("emailNotifications")} />
          </div>
          <div className={rowClass}>
            <span>SMS notifications</span>
            <input type="checkbox" checked={settings.smsNotifications} onChange={() => toggleSetting("smsNotifications")} />
          </div>
          <div className={rowClass}>
            <span>Public profile</span>
            <input type="checkbox" checked={settings.profilePublic} onChange={() => toggleSetting("profilePublic")} />
          </div>
          <div className={rowClass}>
            <span>Dark theme</span>
            <input type="checkbox" checked={isDarkMode} onChange={() => toggleSetting("darkMode")} />
          </div>

          <div className="pt-3">
            <label className="text-sm block mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(event) => setSettings((prev) => ({ ...prev, language: event.target.value }))}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </motion.section>

        <div className="flex justify-end">
          <button onClick={saveAll} className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white inline-flex items-center gap-2 text-sm">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
