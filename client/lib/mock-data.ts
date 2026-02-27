export interface Property {
  id: string;
  name: string;
  type: "apartment" | "house" | "commercial" | "land";
  price: number;
  location: string;
  address: string;
  size: number; // in sqft
  status: "available" | "rented" | "maintenance";
  image: string;
  images: string[]; // Multiple images
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  amenities?: string[];
  description?: string;
  lat?: number;
  lng?: number;
  tenantId?: string;
  isFavorite?: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: number;
}

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
  paymentMethod?: string;
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "paypal" | "bank_transfer";
  name: string;
  lastFourDigits?: string;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  paymentId: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  description: string;
  generatedAt: string;
}

export interface Notification {
  id: string;
  type: "payment_due" | "payment_overdue" | "lease_expiring" | "new_tenant" | "maintenance";
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  interestedProperties: string[]; // Property IDs
  totalDeals: number;
  totalSpent: number;
  status: "active" | "inactive" | "cold";
  dateAdded: string;
  lastContact?: string;
  notes?: string;
}

export interface Deal {
  id: string;
  clientId: string;
  propertyId: string;
  dealPrice: number;
  commission?: number;
  commissionRate?: number; // Percentage
  status: "pending" | "partial" | "completed";
  paymentStatus: "pending" | "partial" | "completed";
  dealDate: string;
  completionDate?: string;
  notes?: string;
  createdAt: string;
}

export const mockProperties: Property[] = [
  {
    id: "1",
    name: "Sunset Hills Luxury Apartments",
    type: "apartment",
    price: 2800,
    location: "Los Angeles, CA",
    address: "1234 Sunset Boulevard, Los Angeles, CA 90028",
    size: 1450,
    status: "rented",
    image: "https://images.pexels.com/photos/8783862/pexels-photo-8783862.jpeg",
    images: [
      "https://images.pexels.com/photos/8783862/pexels-photo-8783862.jpeg",
      "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
      "https://images.pexels.com/photos/29294302/pexels-photo-29294302.jpeg",
    ],
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2019,
    amenities: ["Gym", "Parking", "Rooftop Pool", "Air Conditioning", "Smart Home", "Concierge"],
    description: "Modern 2-bedroom apartment in prime Sunset Strip location with contemporary design, premium finishes, and stunning city views. Features floor-to-ceiling windows, stainless steel appliances, and in-unit laundry. Professional management and 24/7 security.",
    lat: 34.0845,
    lng: -118.2437,
    tenantId: "1",
    isFavorite: false,
  },
  {
    id: "2",
    name: "Downtown LA Premium Lofts",
    type: "apartment",
    price: 3500,
    location: "Los Angeles, CA",
    address: "567 Spring Street, Downtown Los Angeles, CA 90013",
    size: 1950,
    status: "rented",
    image: "https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg",
    images: [
      "https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg",
      "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
      "https://images.pexels.com/photos/8783862/pexels-photo-8783862.jpeg",
    ],
    bedrooms: 3,
    bathrooms: 2.5,
    yearBuilt: 2020,
    amenities: ["Gym", "Rooftop Terrace", "Concierge", "Smart Home", "Parking", "24/7 Security"],
    description: "Luxury 3-bedroom loft in historic Downtown Los Angeles with exposed brick, high ceilings, and modern finishes. Includes premium stainless steel kitchen, marble bathrooms, and downtown skyline views. Walking distance to restaurants, galleries, and entertainment. Pet-friendly building.",
    lat: 34.0628,
    lng: -118.2467,
    tenantId: "2",
    isFavorite: false,
  },
  {
    id: "3",
    name: "Hollywood Heights Contemporary",
    type: "apartment",
    price: 3200,
    location: "Los Angeles, CA",
    address: "789 Hollywood Boulevard, Los Angeles, CA 90028",
    size: 1600,
    status: "available",
    image: "https://images.pexels.com/photos/29294302/pexels-photo-29294302.jpeg",
    images: [
      "https://images.pexels.com/photos/29294302/pexels-photo-29294302.jpeg",
      "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
      "https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg",
    ],
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2021,
    amenities: ["Parking", "Fitness Center", "Pool", "Pet Friendly", "Smart Locks", "Security"],
    description: "Modern 2-bedroom apartment in vibrant Hollywood with contemporary architecture and sleek design. Features open-concept living, premium lighting, and modern finishes throughout. Close to entertainment, dining, and Hollywood attractions. Flexible lease terms available.",
    lat: 34.1022,
    lng: -118.3272,
    isFavorite: false,
  },
  {
    id: "4",
    name: "Santa Monica Beach Residences",
    type: "apartment",
    price: 4200,
    location: "Los Angeles, CA",
    address: "456 Ocean Park Boulevard, Santa Monica, CA 90405",
    size: 1750,
    status: "available",
    image: "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
    images: [
      "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
      "https://images.pexels.com/photos/8783862/pexels-photo-8783862.jpeg",
      "https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg",
    ],
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2022,
    amenities: ["Ocean View", "Rooftop Deck", "Fitness Center", "Parking", "Pet Policy", "Concierge"],
    description: "Beautiful 3-bedroom apartment in prime Santa Monica location just steps from the beach. Features elegant design, ocean-view balconies, and premium kitchen appliances. Building offers 24/7 concierge service, secure parking, and modern fitness facilities. Walk to restaurants, shops, and beaches.",
    lat: 34.0157,
    lng: -118.4944,
    isFavorite: false,
  },
  {
    id: "5",
    name: "Beverly Hills Luxury Tower",
    type: "apartment",
    price: 5500,
    location: "Los Angeles, CA",
    address: "321 Wilshire Boulevard, Beverly Hills, CA 90210",
    size: 2200,
    status: "available",
    image: "https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg",
    images: [
      "https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg",
      "https://images.pexels.com/photos/29294302/pexels-photo-29294302.jpeg",
      "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
    ],
    bedrooms: 3,
    bathrooms: 3,
    yearBuilt: 2023,
    amenities: ["Valet Parking", "Spa", "Wine Cellar", "Concierge", "Security", "Rooftop Garden"],
    description: "Prestigious 3-bedroom penthouse-style apartment in iconic Beverly Hills tower. Features luxury finishes, marble floors, state-of-the-art appliances, and panoramic city views. Building amenities include world-class spa, wine cellar, and 24/7 concierge service. Prime Beverly Hills location with upscale dining and shopping nearby.",
    lat: 34.0728,
    lng: -118.3989,
    isFavorite: false,
  },
  {
    id: "6",
    name: "Culver City Modern Lofts",
    type: "apartment",
    price: 2400,
    location: "Los Angeles, CA",
    address: "123 Washington Boulevard, Culver City, CA 90232",
    size: 1350,
    status: "rented",
    image: "https://images.pexels.com/photos/8783862/pexels-photo-8783862.jpeg",
    images: [
      "https://images.pexels.com/photos/8783862/pexels-photo-8783862.jpeg",
      "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
      "https://images.pexels.com/photos/29294302/pexels-photo-29294302.jpeg",
    ],
    bedrooms: 1,
    bathrooms: 1.5,
    yearBuilt: 2018,
    amenities: ["Parking", "Gym", "Laundry", "Pet Friendly", "Community Room"],
    description: "Stylish 1-bedroom loft in trendy Culver City with open floor plan and industrial-chic design. Features exposed beams, polished concrete floors, and large windows. Near tech companies, studios, and vibrant dining scene. Affordable luxury living in creative neighborhood.",
    lat: 34.0084,
    lng: -118.3999,
    tenantId: "3",
    isFavorite: false,
  },
  {
    id: "7",
    name: "Koreatown Urban Living",
    type: "apartment",
    price: 2100,
    location: "Los Angeles, CA",
    address: "987 Wilshire Boulevard, Koreatown, CA 90005",
    size: 1200,
    status: "available",
    image: "https://images.pexels.com/photos/29294302/pexels-photo-29294302.jpeg",
    images: [
      "https://images.pexels.com/photos/29294302/pexels-photo-29294302.jpeg",
      "https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg",
      "https://images.pexels.com/photos/8783862/pexels-photo-8783862.jpeg",
    ],
    bedrooms: 2,
    bathrooms: 1,
    yearBuilt: 2017,
    amenities: ["Parking", "Gym", "Rooftop", "Pet Policy", "Doorman"],
    description: "Contemporary 2-bedroom apartment in vibrant Koreatown with modern amenities and convenient location. Close to restaurants, shops, and entertainment. Building features secure parking, fitness center, and 24-hour doorman. Walkable neighborhood with excellent public transportation access.",
    lat: 34.0699,
    lng: -118.2968,
    isFavorite: false,
  },
  {
    id: "8",
    name: "Weho Modern Residences",
    type: "apartment",
    price: 3800,
    location: "Los Angeles, CA",
    address: "654 Larrabee Street, West Hollywood, CA 90048",
    size: 1850,
    status: "available",
    image: "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
    images: [
      "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg",
      "https://images.pexels.com/photos/29294302/pexels-photo-29294302.jpeg",
      "https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg",
    ],
    bedrooms: 2,
    bathrooms: 2.5,
    yearBuilt: 2020,
    amenities: ["Rooftop Lounge", "Parking", "Fitness Center", "Pet Friendly", "Security"],
    description: "Sophisticated 2-bedroom apartment in prestigious West Hollywood with contemporary design and premium finishes. Features hardwood floors, stainless steel kitchen, and private balcony. Building offers rooftop lounge with city views, secure parking, and 24-hour security. Walking distance to Sunset Strip and trendy restaurants.",
    lat: 34.0816,
    lng: -118.3733,
    isFavorite: false,
  },
];

export const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    email: "marcus.johnson@example.com",
    phone: "(323) 555-0123",
    propertyId: "1",
    leaseStartDate: "2023-02-01",
    leaseEndDate: "2025-01-31",
    monthlyRent: 2800,
  },
  {
    id: "2",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone: "(213) 555-0456",
    propertyId: "2",
    leaseStartDate: "2023-06-15",
    leaseEndDate: "2025-06-14",
    monthlyRent: 3500,
  },
  {
    id: "3",
    name: "David Chen",
    email: "david.chen@example.com",
    phone: "(310) 555-0789",
    propertyId: "6",
    leaseStartDate: "2023-09-01",
    leaseEndDate: "2025-08-31",
    monthlyRent: 2400,
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "credit_card",
    name: "Visa",
    lastFourDigits: "4242",
    isDefault: true,
  },
  {
    id: "2",
    type: "paypal",
    name: "PayPal",
    isDefault: false,
  },
  {
    id: "3",
    type: "bank_transfer",
    name: "Bank Account",
    lastFourDigits: "5678",
    isDefault: false,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "INV-LSB-001",
    paymentId: "1",
    tenantId: "1",
    propertyId: "1",
    amount: 2800,
    issueDate: "2024-04-01",
    dueDate: "2024-05-01",
    description: "Monthly Rent - Sunset Hills Luxury Apartments",
    generatedAt: "2024-04-01",
  },
  {
    id: "INV-LSB-002",
    paymentId: "2",
    tenantId: "1",
    propertyId: "1",
    amount: 2800,
    issueDate: "2024-03-01",
    dueDate: "2024-04-01",
    description: "Monthly Rent - Sunset Hills Luxury Apartments",
    generatedAt: "2024-03-01",
  },
  {
    id: "INV-LSB-003",
    paymentId: "4",
    tenantId: "2",
    propertyId: "2",
    amount: 3500,
    issueDate: "2024-04-01",
    dueDate: "2024-05-01",
    description: "Monthly Rent - Downtown LA Premium Lofts",
    generatedAt: "2024-04-01",
  },
  {
    id: "INV-LSB-004",
    paymentId: "5",
    tenantId: "3",
    propertyId: "6",
    amount: 2400,
    issueDate: "2024-04-01",
    dueDate: "2024-05-01",
    description: "Monthly Rent - Culver City Modern Lofts",
    generatedAt: "2024-04-01",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "payment_overdue",
    title: "Overdue Payment",
    message: "Payment from John Smith (Sunset Apartments) is overdue by 30 days",
    relatedId: "3",
    isRead: false,
    createdAt: "2024-04-02",
  },
  {
    id: "2",
    type: "payment_due",
    title: "Payment Due Soon",
    message: "Payment from Sarah Johnson (Downtown Lofts) is due in 2 days",
    relatedId: "8",
    isRead: false,
    createdAt: "2024-03-30",
  },
  {
    id: "3",
    type: "lease_expiring",
    title: "Lease Expiring",
    message: "Lease for John Smith expires in 90 days",
    relatedId: "1",
    isRead: true,
    createdAt: "2024-02-15",
  },
  {
    id: "4",
    type: "maintenance",
    title: "Maintenance Required",
    message: "Prime Industrial Space needs HVAC maintenance",
    relatedId: "6",
    isRead: true,
    createdAt: "2024-02-10",
  },
];

export const mockPayments: Payment[] = [
  {
    id: "P-LSB-001",
    tenantId: "1",
    propertyId: "1",
    amount: 2800,
    dueDate: "2024-02-01",
    paidDate: "2024-02-01",
    status: "paid",
  },
  {
    id: "P-LSB-002",
    tenantId: "1",
    propertyId: "1",
    amount: 2800,
    dueDate: "2024-03-01",
    paidDate: "2024-03-02",
    status: "paid",
  },
  {
    id: "P-LSB-003",
    tenantId: "1",
    propertyId: "1",
    amount: 2800,
    dueDate: "2024-04-01",
    paidDate: undefined,
    status: "pending",
  },
  {
    id: "P-LSB-004",
    tenantId: "1",
    propertyId: "1",
    amount: 2800,
    dueDate: "2024-05-01",
    paidDate: undefined,
    status: "pending",
  },
  {
    id: "P-LSB-005",
    tenantId: "2",
    propertyId: "2",
    amount: 3500,
    dueDate: "2024-02-15",
    paidDate: "2024-02-15",
    status: "paid",
  },
  {
    id: "P-LSB-006",
    tenantId: "2",
    propertyId: "2",
    amount: 3500,
    dueDate: "2024-03-15",
    paidDate: "2024-03-15",
    status: "paid",
  },
  {
    id: "P-LSB-007",
    tenantId: "2",
    propertyId: "2",
    amount: 3500,
    dueDate: "2024-04-15",
    paidDate: undefined,
    status: "pending",
  },
  {
    id: "P-LSB-008",
    tenantId: "2",
    propertyId: "2",
    amount: 3500,
    dueDate: "2024-05-15",
    paidDate: undefined,
    status: "pending",
  },
  {
    id: "P-LSB-009",
    tenantId: "3",
    propertyId: "6",
    amount: 2400,
    dueDate: "2024-02-01",
    paidDate: "2024-02-01",
    status: "paid",
  },
  {
    id: "P-LSB-010",
    tenantId: "3",
    propertyId: "6",
    amount: 2400,
    dueDate: "2024-03-01",
    paidDate: "2024-03-01",
    status: "paid",
  },
  {
    id: "P-LSB-011",
    tenantId: "3",
    propertyId: "6",
    amount: 2400,
    dueDate: "2024-04-01",
    paidDate: undefined,
    status: "pending",
  },
];

export const mockClients: Client[] = [
  {
    id: "C1",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Investor Ave, San Francisco, CA 94102",
    interestedProperties: ["3", "4"],
    totalDeals: 2,
    totalSpent: 950000,
    status: "active",
    dateAdded: "2023-08-15",
    lastContact: "2024-04-01",
    notes: "VIP client, interested in luxury properties",
  },
  {
    id: "C2",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Street, Oakland, CA 94601",
    interestedProperties: ["1", "2"],
    totalDeals: 1,
    totalSpent: 450000,
    status: "active",
    dateAdded: "2024-01-10",
    lastContact: "2024-03-28",
    notes: "First-time buyer, prefers apartments",
  },
  {
    id: "C3",
    name: "David Martinez",
    email: "david.martinez@company.com",
    phone: "+1 (555) 345-6789",
    address: "789 Tech Boulevard, San Jose, CA 95110",
    interestedProperties: ["5", "6"],
    totalDeals: 3,
    totalSpent: 1250000,
    status: "active",
    dateAdded: "2022-11-20",
    lastContact: "2024-04-03",
    notes: "Commercial property investor",
  },
  {
    id: "C4",
    name: "Lisa Anderson",
    email: "lisa.anderson@gmail.com",
    phone: "+1 (555) 456-7890",
    address: "321 Beach Road, Malibu, CA 90265",
    interestedProperties: ["4"],
    totalDeals: 0,
    totalSpent: 0,
    status: "cold",
    dateAdded: "2024-02-05",
    lastContact: "2024-02-15",
    notes: "Inquiry about luxury properties, waiting for new listings",
  },
];

export const mockDeals: Deal[] = [
  {
    id: "D1",
    clientId: "C1",
    propertyId: "3",
    dealPrice: 450000,
    commission: 22500,
    commissionRate: 5,
    status: "completed",
    paymentStatus: "completed",
    dealDate: "2023-09-10",
    completionDate: "2023-10-15",
    notes: "Garden House sale completed",
    createdAt: "2023-09-10",
  },
  {
    id: "D2",
    clientId: "C1",
    propertyId: "4",
    dealPrice: 500000,
    commission: 25000,
    commissionRate: 5,
    status: "completed",
    paymentStatus: "completed",
    dealDate: "2024-02-01",
    completionDate: "2024-02-20",
    notes: "Ocean View Villa sale completed",
    createdAt: "2024-02-01",
  },
  {
    id: "D3",
    clientId: "C2",
    propertyId: "1",
    dealPrice: 450000,
    commission: 13500,
    commissionRate: 3,
    status: "completed",
    paymentStatus: "partial",
    dealDate: "2024-01-15",
    completionDate: "2024-02-01",
    notes: "Sunset Apartments sale, partial payment received",
    createdAt: "2024-01-15",
  },
  {
    id: "D4",
    clientId: "C3",
    propertyId: "5",
    dealPrice: 250000,
    commission: 12500,
    commissionRate: 5,
    status: "pending",
    paymentStatus: "pending",
    dealDate: "2024-03-20",
    notes: "Tech Hub Office - awaiting completion",
    createdAt: "2024-03-20",
  },
  {
    id: "D5",
    clientId: "C3",
    propertyId: "2",
    dealPrice: 500000,
    commission: 15000,
    commissionRate: 3,
    status: "pending",
    paymentStatus: "pending",
    dealDate: "2024-04-01",
    notes: "Downtown Lofts - negotiation phase",
    createdAt: "2024-04-01",
  },
];
