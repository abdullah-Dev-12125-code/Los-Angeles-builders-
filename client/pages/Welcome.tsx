import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Home,
  KeyRound,
  Menu,
  Search,
  Star,
  TrendingUp,
  UserCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Projects", href: "#listings" },
  { label: "Services", href: "#market" },
  { label: "Cases", href: "#story" },
  { label: "About", href: "#contact" },
];

const modes = ["All", "Buy", "Sell", "Rent"];

const listings = [
  {
    title: "Urban Edge",
    type: "Buy",
    subtitle: "Luxury apartments",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1000&q=80",
  },
  {
    title: "Nova Residences",
    type: "Sell",
    subtitle: "High-rise 42 floors",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80",
  },
  {
    title: "Emerald Tower",
    type: "Rent",
    subtitle: "Premium rental suites",
    image: "https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=1000&q=80",
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("All");

  const filtered = useMemo(() => {
    if (activeMode === "All") return listings;
    return listings.filter((item) => item.type === activeMode);
  }, [activeMode]);

  return (
    <div id="top" className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-blue-200/50 bg-sky-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <button type="button" onClick={() => navigate("/welcome")} className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-lg font-bold text-blue-950">
              A
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-bold text-blue-950">Aurum</span>
              <span className="block text-[11px] text-blue-700">Beyond Properties</span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-sm font-medium text-blue-900/80 md:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-blue-950 transition-colors">
                {link.label}
              </a>
            ))}
            <Button
              onClick={() => navigate("/user-login")}
              className="rounded-full bg-blue-950 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-blue-900"
            >
              Contact Us
            </Button>
          </nav>

          <button
            type="button"
            className="text-blue-900 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-blue-200/60 bg-sky-50 px-4 pb-4 md:hidden">
            <div className="flex flex-col gap-3 pt-4 text-sm font-medium text-blue-900/80">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-blue-950">
                  {link.label}
                </a>
              ))}
              <Button
                onClick={() => navigate("/user-login")}
                className="mt-1 rounded-full bg-blue-950 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-blue-900"
              >
                Contact Us
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-b from-sky-300 via-cyan-300 to-sky-200 p-7 sm:p-10">
            <div className="max-w-lg space-y-5">
              <h1 className="text-4xl font-extrabold leading-tight text-blue-950 sm:text-6xl">
                Building the foundation of excellence
              </h1>
              <p className="max-w-md text-sm text-blue-950/80 sm:text-base">
                One destination to buy, sell, and rent properties with confidence and clarity.
              </p>
              <Button
                onClick={() => navigate("/user-login")}
                className="rounded-full bg-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-orange-400"
              >
                Book a call
              </Button>
            </div>

            <img
              src="https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200&q=80"
              alt="Featured house"
              className="mt-8 h-56 w-full rounded-[30px] object-cover object-center shadow-2xl sm:h-72"
            />
          </div>

          <div className="overflow-hidden rounded-[36px] bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 p-7 text-white sm:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Featured project</p>
            <h2 className="mt-2 text-3xl font-bold">Zenith Residences</h2>
            <p className="mt-1 text-sm text-cyan-200">San Francisco, 2026</p>

            <img
              src="https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1200&q=80"
              alt="High-rise tower"
              className="mt-6 h-80 w-full rounded-[28px] object-cover"
            />

            <Button
              onClick={() => navigate("/seller-login")}
              className="mt-6 rounded-full bg-amber-400 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-950 hover:bg-amber-300"
            >
              Seller Portal
            </Button>
          </div>
        </section>

        <section className="-mt-1 grid gap-4 rounded-[32px] bg-white p-5 shadow-xl sm:p-6 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <UserCircle2 className="h-10 w-10 text-cyan-600" />
              <div>
                <p className="font-semibold text-slate-900">Natasha Taylor</p>
                <p className="text-xs text-slate-500">Aesthetic enthusiast</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              “The easiest way I have found to compare property options and close faster.”
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-blue-950">Want free consultation from our agent?</p>
            <Button
              onClick={() => navigate("/user-login")}
              className="mt-4 rounded-full bg-blue-950 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-blue-900"
            >
              Let&apos;s Talk
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-amber-100 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-700">Customer score</p>
            <p className="mt-2 text-3xl font-bold text-blue-950">60%</p>
            <p className="mt-1 text-sm text-slate-700">Creative spaces inspired and built with trust.</p>
          </div>
        </section>

        <section id="market" className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[32px] bg-white p-6 shadow-lg sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Market actions</p>
            <h3 className="mt-3 text-3xl font-bold text-blue-950">Building dreams, one design at a time</h3>
            <p className="mt-3 text-sm text-slate-600">
              Choose your path instantly: buy your next home, list and sell property, or find ideal rentals.
            </p>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => navigate("/user-login")}
                className="flex items-center justify-between rounded-2xl bg-cyan-100 px-4 py-3 text-left"
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-950">
                  <Home className="h-4 w-4" /> Buy Properties
                </span>
                <ArrowRight className="h-4 w-4 text-blue-900" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/seller-login")}
                className="flex items-center justify-between rounded-2xl bg-amber-100 px-4 py-3 text-left"
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-950">
                  <TrendingUp className="h-4 w-4" /> Sell Properties
                </span>
                <ArrowRight className="h-4 w-4 text-blue-900" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/user-login")}
                className="flex items-center justify-between rounded-2xl bg-blue-100 px-4 py-3 text-left"
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-950">
                  <KeyRound className="h-4 w-4" /> Rent Properties
                </span>
                <ArrowRight className="h-4 w-4 text-blue-900" />
              </button>
            </div>
          </div>

          <div id="story" className="rounded-[32px] bg-gradient-to-br from-cyan-300 to-sky-200 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-3xl font-bold text-blue-950">Turning bold visions into reality</h3>
              <Button
                onClick={() => navigate("/user-login")}
                className="rounded-full bg-orange-500 px-5 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-orange-400"
              >
                Build Dreams
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=80",
                "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80",
                "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=900&q=80",
              ].map((image) => (
                <img key={image} src={image} alt="Property showcase" className="h-40 w-full rounded-2xl object-cover" />
              ))}
            </div>
          </div>
        </section>

        <section id="listings" className="mt-10 rounded-[34px] bg-blue-950 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Active opportunities</p>
              <h3 className="mt-2 text-3xl font-bold">Buy, sell and rent with confidence</h3>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
              <Search className="h-4 w-4 text-cyan-200" />
              <input
                aria-label="Search listings"
                placeholder="Search by area"
                className="bg-transparent text-sm text-white placeholder:text-white/65 outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {modes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setActiveMode(mode)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  activeMode === mode
                    ? "bg-amber-400 text-blue-950"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, index) => (
              <article
                key={item.title}
                className={`overflow-hidden rounded-3xl ${
                  index === 1 ? "bg-amber-200 text-blue-950" : "bg-white/10 text-white"
                }`}
              >
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                <div className="space-y-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">{item.type}</p>
                  <h4 className="text-lg font-bold">{item.title}</h4>
                  <p className="text-sm opacity-80">{item.subtitle}</p>
                  <p className="inline-flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-4 w-4 fill-current" /> 4.9
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="mt-10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:px-6 lg:flex-row lg:text-left">
          <div>
            <p className="text-xl font-bold text-white">Aurum.</p>
            <p className="mt-1 text-sm text-white/65">Property platform for buying, selling, and renting.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => navigate("/user-login")}
              className="rounded-full bg-amber-400 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-950 hover:bg-amber-300"
            >
              User Login
            </Button>
            <Button
              onClick={() => navigate("/seller-login")}
              className="rounded-full bg-cyan-300 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-950 hover:bg-cyan-200"
            >
              Seller Login
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
