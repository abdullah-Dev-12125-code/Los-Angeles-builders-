export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  seller: string;
  sellerImage: string;
  tags: string[];
  beds: number;
  baths: number;
  sqft: number;
  type: "residential" | "commercial" | "industrial" | "luxury";
  featured: boolean;
  trending: boolean;
  isNew: boolean;
}

// Generate high-quality dummy properties
export const generateProperties = (count: number): Property[] => {
  const locations = [
    "Downtown LA",
    "West Hollywood",
    "Venice Beach",
    "Santa Monica",
    "Malibu",
    "Beverly Hills",
    "Culver City",
    "Studio City",
    "Pasadena",
    "Long Beach",
    "Silver Lake",
    "Echo Park",
    "Los Feliz",
    "Griffith Park",
    "Mid-City",
  ];

  const titles = [
    "Modern Luxury Penthouse",
    "Coastal Paradise Villa",
    "Downtown Loft",
    "Mediterranean Estate",
    "Contemporary Gem",
    "Beachfront Retreat",
    "Urban Studio",
    "Hillside Manor",
    "Art Deco Apartment",
    "Modern Farmhouse",
    "Industrial Warehouse",
    "Minimalist Condo",
    "Tuscan-Inspired Home",
    "Glass House",
    "Cozy Bungalow",
    "Sunset Hills Estate",
    "Oceanview Tower",
    "Garden District Cottage",
    "Tech Hub Loft",
    "Artist's Studio",
  ];

  const descriptions = [
    "Stunning views, modern architecture, perfect for families",
    "Luxury living at its finest with premium amenities",
    "Perfect investment opportunity in prime location",
    "Recent renovations, move-in ready, great neighborhood",
    "Spacious and bright, open floor plan design",
    "Close to shops, restaurants, and entertainment",
    "Private outdoor space with mature landscaping",
    "High-end finishes and smart home technology",
    "Walkable community with excellent schools nearby",
    "Energy-efficient, solar panels, sustainable living",
    "Rooftop terrace with city skyline views",
    "Heated infinity pool overlooking the ocean",
    "Wine cellar and home theater included",
    "Smart home automation system throughout",
    "Direct beach access with private cabana",
    "Gourmet chef's kitchen and breakfast nook",
    "Master suite with spa-like bathroom",
    "Multiple guest houses on property",
    "Private elevator access to all floors",
    "Floor-to-ceiling windows and skylights",
  ];

  const sellers = [
    "Sarah Johnson",
    "Mike Chen",
    "Lisa Rodriguez",
    "Thomas Anderson",
    "Jennifer Lee",
    "David Martinez",
    "Emily Robinson",
    "Carlos Garcia",
    "Amanda White",
    "James Wilson",
    "Nicole Santos",
    "Robert Kim",
    "Patricia Moore",
    "Christopher Lee",
    "Michelle Taylor",
    "Daniel Brown",
    "Jessica Anderson",
    "Andrew Johnson",
  ];

  const tags = ["New", "Luxury", "Hot", "Trending", "Premium", "Exclusive"];

  // Diverse image URLs for variety
  const imageCollections = [
    "photo-1502672260266-1c1ef2d93688", // Modern apartment exterior
    "photo-1512917774080-9a485595a4ae", // Contemporary living room
    "photo-1564013799919-ab600027ffc6", // Bedroom
    "photo-1560448204-e02f11c3d0e2",    // Luxury kitchen
    "photo-1516382799033-1b5ef659b8ae", // Dining room
    "photo-1493857671505-72967e2e2760", // Modern exterior
    "photo-1522708323590-d24dbb6b0267", // Bedroom view
    "photo-1570129477492-45a003537e1f", // Living space
    "photo-1600210174714-147564fb8ffa", // Kitchen
    "photo-1615529162883-618f655a6a6d", // Bathroom
    "photo-1585399001003-8f29d1fb60e5", // Bedroom modern
    "photo-1568605114967-8130f3a36994", // Living room
  ];

  const properties: Property[] = [];

  for (let i = 0; i < count; i++) {
    // More diverse price ranges
    const priceType = Math.random();
    let basePrice: number;
    if (priceType < 0.3) {
      basePrice = Math.floor(Math.random() * 800000) + 300000;      // 300k - 1.1M
    } else if (priceType < 0.6) {
      basePrice = Math.floor(Math.random() * 1500000) + 1000000;    // 1M - 2.5M
    } else if (priceType < 0.9) {
      basePrice = Math.floor(Math.random() * 2000000) + 2500000;    // 2.5M - 4.5M
    } else {
      basePrice = Math.floor(Math.random() * 3000000) + 5000000;    // 5M - 8M
    }

    const type = (
      ["residential", "commercial", "industrial", "luxury"] as const
    )[Math.floor(Math.random() * 4)];

    // Better tag distribution
    const tagSelection: string[] = [];
    if (Math.random() > 0.7) tagSelection.push("New");
    if (Math.random() > 0.75) tagSelection.push(type === "luxury" ? "Luxury" : "Hot");
    if (Math.random() > 0.8) tagSelection.push("Trending");
    if (tagSelection.length === 0) {
      tagSelection.push(tags[Math.floor(Math.random() * tags.length)]);
    }

    // Diverse image URLs with unseeded randomization
    const imageIndices = [
      Math.floor(Math.random() * imageCollections.length),
      Math.floor(Math.random() * imageCollections.length),
      Math.floor(Math.random() * imageCollections.length),
      Math.floor(Math.random() * imageCollections.length),
      Math.floor(Math.random() * imageCollections.length),
    ];

    properties.push({
      id: `prop-${i + 1}`,
      title: `${titles[Math.floor(Math.random() * titles.length)]} #${i + 1}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      price: Math.round(basePrice / 10000) * 10000, // Round to nearest 10k
      rating: Math.floor(Math.random() * 20 + 40) / 10, // 4.0 - 6.0
      reviews: Math.floor(Math.random() * 200) + 5,
      images: imageIndices.map(
        (imgIdx) =>
          `https://images.unsplash.com/${imageCollections[imgIdx]}?w=600&h=400&fit=crop`
      ),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      seller: sellers[Math.floor(Math.random() * sellers.length)],
      sellerImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=seller${i}`,
      tags: tagSelection,
      beds: Math.floor(Math.random() * 6) + 1,
      baths: Math.floor(Math.random() * 5) + 1,
      sqft: Math.floor(Math.random() * 5000) + 500,
      type,
      featured: Math.random() > 0.85,
      trending: Math.random() > 0.9,
      isNew: Math.random() > 0.92,
    });
  }

  return properties;
};

export const properties = generateProperties(120);

// Filter utilities
export const filterProperties = (
  props: Property[],
  filters: {
    minPrice?: number;
    maxPrice?: number;
    location?: string[];
    type?: string[];
    rating?: number[];
    searchQuery?: string;
  }
): Property[] => {
  return props.filter((prop) => {
    if (filters.minPrice && prop.price < filters.minPrice) return false;
    if (filters.maxPrice && prop.price > filters.maxPrice) return false;
    
    if (
      filters.location &&
      filters.location.length > 0 &&
      !filters.location.includes(prop.location)
    )
      return false;
    
    if (
      filters.type &&
      filters.type.length > 0 &&
      !filters.type.includes(prop.type)
    )
      return false;
    
    if (filters.rating && filters.rating.length > 0) {
      const meetsRating = filters.rating.some((r) => prop.rating >= r);
      if (!meetsRating) return false;
    }
    
    if (
      filters.searchQuery &&
      !prop.title
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) &&
      !prop.location
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase())
    )
      return false;
    
    return true;
  });
};
