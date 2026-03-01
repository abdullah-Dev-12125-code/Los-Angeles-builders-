import { getRandomPropertyImage } from "@/lib/image-service";

export type PropertyStatus = "active" | "pending" | "rejected" | "draft";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: "residential" | "commercial" | "construction" | "luxury";
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  featuredImage: string;
  rating: number;
  reviews: number;
  sellerId: string;
  status: PropertyStatus;
  views: number;
  revenue: number;
  inquiries: number;
  createdAt: Date;
}

const PROPERTY_KEY = "platformProperties";

const locations = [
  "Beverly Hills, Los Angeles",
  "Santa Monica, Los Angeles",
  "Downtown Los Angeles",
  "Malibu Coast",
  "West Hollywood",
  "Culver City",
  "Pasadena",
  "Manhattan Beach",
  "Silver Lake",
  "Studio City",
];

const types: Property["type"][] = ["residential", "commercial", "construction", "luxury"];

const titles = [
  "Skyline Residences",
  "Harbor Point Offices",
  "Sunset View Estates",
  "Crestline Business Park",
  "Bluewater Luxury Villas",
  "Urban Arc Condominiums",
  "Palm Grove Homes",
  "Metro Core Commercial Tower",
  "The Grand Meridian",
  "Vista Hills Retreat",
];

const amenitiesPool = [
  "Pool",
  "Gym",
  "Security",
  "Parking",
  "Smart Home",
  "EV Charging",
  "Garden",
  "Rooftop",
  "Concierge",
  "Co-working Lounge",
];

const randomFrom = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export const generateMockProperties = (count = 36): Property[] => {
  return Array.from({ length: count }, (_, index) => {
    const type = randomFrom(types);
    const beds = type === "commercial" ? 0 : Math.floor(Math.random() * 5) + 1;
    const baths = type === "commercial" ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 4) + 1;
    const statusRoll = Math.random();
    const status: PropertyStatus = statusRoll > 0.82 ? "pending" : statusRoll < 0.08 ? "rejected" : "active";
    const featuredImage = getRandomPropertyImage().url;
    const images = [featuredImage, getRandomPropertyImage().url, getRandomPropertyImage().url];
    const area = type === "commercial" ? Math.floor(Math.random() * 9000) + 1800 : Math.floor(Math.random() * 4200) + 700;
    const price = type === "luxury"
      ? Math.floor(Math.random() * 7000000) + 3000000
      : type === "commercial"
        ? Math.floor(Math.random() * 4500000) + 1200000
        : Math.floor(Math.random() * 2200000) + 350000;

    return {
      id: `property-${index + 1}`,
      title: `${randomFrom(titles)} ${index + 1}`,
      description: "Premium-grade property with modern infrastructure, strong location demand, and high investment potential.",
      price,
      location: randomFrom(locations),
      type,
      bedrooms: beds,
      bathrooms: baths,
      area,
      amenities: amenitiesPool.sort(() => 0.5 - Math.random()).slice(0, 4),
      images,
      featuredImage,
      rating: Number((Math.random() * 1.2 + 3.8).toFixed(1)),
      reviews: Math.floor(Math.random() * 280) + 8,
      sellerId: `seller-${(index % 8) + 1}`,
      status,
      views: Math.floor(Math.random() * 15000) + 400,
      revenue: Math.floor(Math.random() * 550000) + 20000,
      inquiries: Math.floor(Math.random() * 80) + 4,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000),
    };
  });
};

const parseProperty = (property: Omit<Property, "createdAt"> & { createdAt: string | Date }): Property => ({
  ...property,
  createdAt: new Date(property.createdAt),
});

export const getProperties = (): Property[] => {
  const raw = localStorage.getItem(PROPERTY_KEY);
  if (!raw) {
    const seeded = generateMockProperties(40);
    localStorage.setItem(PROPERTY_KEY, JSON.stringify(seeded));
    return seeded;
  }

  const parsed = JSON.parse(raw) as Array<Omit<Property, "createdAt"> & { createdAt: string }>;
  return parsed.map(parseProperty);
};

const saveProperties = (properties: Property[]) => {
  localStorage.setItem(PROPERTY_KEY, JSON.stringify(properties));
};

export const upsertProperty = (property: Property) => {
  const current = getProperties();
  const exists = current.some((item) => item.id === property.id);
  const updated = exists
    ? current.map((item) => (item.id === property.id ? property : item))
    : [property, ...current];
  saveProperties(updated);
  return updated;
};

export const deletePropertyById = (id: string) => {
  const updated = getProperties().filter((property) => property.id !== id);
  saveProperties(updated);
  return updated;
};

export const updatePropertyStatus = (id: string, status: PropertyStatus) => {
  const updated = getProperties().map((property) =>
    property.id === id ? { ...property, status } : property,
  );
  saveProperties(updated);
  return updated;
};
