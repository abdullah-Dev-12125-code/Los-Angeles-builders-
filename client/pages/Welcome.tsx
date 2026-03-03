import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Calendar,
  MapPin,
  Menu,
  ShieldCheck,
  Star,
  Users2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Home", href: "#top" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const projects = [
  {
    title: "Downtown Office Build",
    description: "Steel-frame commercial hub with premium finishes.",
    image: "/assets/project-commercial.jpg",
    location: "Downtown LA",
    rating: 4.9,
    tag: "Commercial",
    quote: "$2.4M+",
  },
  {
    title: "Sunset High-Rise",
    description: "Luxury residential tower with skyline views.",
    image: "/assets/project-highrise.jpg",
    location: "West LA",
    rating: 4.8,
    tag: "Residential",
    quote: "$3.1M+",
  },
  {
    title: "Harbor Infrastructure",
    description: "Heavy civil works and logistics upgrades.",
    image: "/assets/project-infrastructure.jpg",
    location: "Port of LA",
    rating: 4.7,
    tag: "Infrastructure",
    quote: "$4.0M+",
  },
  {
    title: "Industrial Framework",
    description: "Precision fabrication and structural assembly.",
    image: "/assets/project-structural.jpg",
    location: "South LA",
    rating: 4.8,
    tag: "Industrial",
    quote: "$1.6M+",
  },
];

const services = [
  {
    title: "Design-Build",
    description: "Single-team delivery from concept to completion.",
    icon: Award,
  },
  {
    title: "Safety First",
    description: "Strict compliance and on-site risk management.",
    icon: ShieldCheck,
  },
  {
    title: "Expert Crews",
    description: "Skilled project managers and trade specialists.",
    icon: Users2,
  },
];

const testimonials = [
  {
    name: "Olivia Chen",
    role: "Operations Director",
    quote: "Los Angeles Builders delivered on time with unmatched craftsmanship.",
  },
  {
    name: "Marcus Rivera",
    role: "Development Partner",
    quote: "Their coordination and on-site execution were flawless.",
  },
  {
    name: "Priya Patel",
    role: "Project Owner",
    quote: "Clear communication, clean job sites, and a great final product.",
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-[#f7f5f2] text-gray-900">
      <header className="sticky top-0 z-50 bg-[#f7f5f2]/90 backdrop-blur border-b border-black/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Los Angeles Builders" className="h-16 w-16" />
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            {navigation.map((item) => (
              <a key={item.label} href={item.href} className="hover:text-gray-900 transition-colors">
                {item.label}
              </a>
            ))}
            <Button
              onClick={() => navigate("/user-login")}
              variant="ghost"
              className="rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-gray-800 shadow-none"
            >
              Get Quote
            </Button>
          </nav>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/5 bg-[#f7f5f2] px-4 pb-4">
            <div className="flex flex-col gap-3 pt-4 text-sm font-medium text-gray-600">
              {navigation.map((item) => (
                <a key={item.label} href={item.href} className="hover:text-gray-900 transition-colors">
                  {item.label}
                </a>
              ))}
              <Button
                onClick={() => navigate("/user-login")}
                variant="ghost"
                className="rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-gray-800 shadow-none"
              >
                Get Quote
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:min-h-[600px] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Los Angeles Construction Experts
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
              Build Your Dream.
              <span className="block text-gray-500">Crafting spaces, shaping futures across Los Angeles.</span>
            </h1>
            <p className="max-w-xl text-base text-gray-600 sm:text-lg">
              We deliver high-impact commercial and residential builds with precision planning,
              elite crews, and transparent project controls.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/user-login")}
                variant="ghost"
                className="rounded-full bg-gray-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-gray-800 shadow-none"
              >
                Explore Projects
              </Button>
              <Button
                onClick={() => navigate("/seller-login")}
                variant="ghost"
                className="rounded-full border-2 border-gray-300 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-900 hover:bg-gray-100 hover:border-gray-400 shadow-none"
              >
                Seller Portal
              </Button>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <div>
                <p className="text-xl font-semibold text-gray-900">1600+</p>
                <p>Projects Delivered</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">98%</p>
                <p>On-Time Delivery</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">25+</p>
                <p>Years Experience</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] sm:h-[500px] lg:h-[550px]">
            <div className="absolute -left-8 top-8 hidden h-12 w-12 rounded-2xl bg-white shadow-lg lg:block" />
            <img
              src="/assets/hero-crane.jpg"
              alt="Tower crane at a construction site"
              className="h-full w-full rounded-[32px] object-cover object-center shadow-2xl"
            />
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-6 pb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Our Portfolio</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Discover our completed projects</h2>
            </div>
            <Button
              variant="ghost"
              className="hidden rounded-full border-2 border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 hover:border-gray-400 text-xs font-semibold uppercase tracking-[0.2em] md:flex shadow-none"
            >
              View All
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                    {project.tag}
                  </span>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      <Star className="h-4 w-4 text-amber-500" />
                      {project.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{project.location}</span>
                    <span className="font-semibold text-gray-900">{project.quote}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Why Choose Us</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Built on experience. Driven by quality.</h2>
              <p className="text-sm text-gray-600">
                We coordinate every phase with clear timelines, dedicated supervision, and proactive
                communication so your project stays on scope and on budget.
              </p>
              <Button
                variant="ghost"
                className="rounded-full border-2 border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 hover:border-gray-400 text-xs font-semibold uppercase tracking-[0.2em] shadow-none"
              >
                Our Services
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                  <service.icon className="h-8 w-8 text-amber-500" />
                  <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-[32px] border border-black/5 bg-white p-10 shadow-sm">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Meet the Experts</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">The team behind Los Angeles Builders</h2>
                <p className="text-sm text-gray-600">
                  Our leadership team blends technical expertise with client-first delivery. We bring
                  certified managers, field engineers, and safety officers to every build.
                </p>
              </div>
              <Button variant="ghost" className="rounded-full bg-gray-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-gray-800 shadow-none">
                Meet the Team
              </Button>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { name: "Abdullah Hussain", role: "CEO & Founder" },
                { name: "Fatima Malik", role: "Senior Site Engineer" },
                { name: "Imran Qureshi", role: "Construction Director" },
              ].map((member) => (
                <div key={member.name} className="rounded-2xl border border-black/5 bg-[#f7f5f2] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-gray-900">
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Client Voices</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">What our clients say</h2>
              <p className="mt-4 text-sm text-gray-600">
                We are proud to be trusted by commercial, residential, and infrastructure partners across LA.
              </p>
              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-[#f7f5f2] px-5 py-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-900">4.9 average project rating</p>
              </div>
            </div>
            <div className="grid gap-4">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-700">"{item.quote}"</p>
                  <div className="mt-4 text-sm font-semibold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-black/5 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Start your project with Los Angeles Builders</h2>
            <p className="text-sm text-gray-600">
              Tell us about your build. We will respond with a tailored plan, timeline, and quote.
            </p>
            <Button
              onClick={() => navigate("/user-login")}
              variant="ghost"
              className="rounded-full bg-gray-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-gray-800 shadow-none"
            >
              Request a Quote
            </Button>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" />
              1080 Wilshire Blvd, Los Angeles, CA
            </div>
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 text-amber-500" />
              contact@labuilders.com
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              Mon-Fri, 8:00AM-6:00PM
            </div>
          </div>
        </div>
        <div className="border-t border-black/5">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-gray-500 sm:flex-row sm:px-6">
            <div>© 2026 Los Angeles Builders. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
