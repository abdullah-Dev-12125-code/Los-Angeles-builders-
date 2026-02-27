"""Mock data for Los Santos Builders real estate management system."""

from datetime import datetime, timedelta
from typing import List, Dict, Any

# Mock Properties Data
MOCK_PROPERTIES = [
    {
        "id": "1",
        "name": "Sunset Hills Luxury Apartments",
        "type": "apartment",
        "price": 2800,
        "location": "Los Angeles, CA",
        "address": "1234 Sunset Boulevard, Los Angeles, CA 90028",
        "size": 1450,
        "status": "rented",
        "bedrooms": 2,
        "bathrooms": 2,
        "year_built": 2019,
        "amenities": ["Gym", "Parking", "Rooftop Pool", "Air Conditioning", "Smart Home", "Concierge"],
        "description": "Modern 2-bedroom apartment in prime Sunset Strip location with contemporary design, premium finishes, and stunning city views.",
        "lat": 34.0845,
        "lng": -118.2437,
    },
    {
        "id": "2",
        "name": "Downtown LA Premium Lofts",
        "type": "apartment",
        "price": 3500,
        "location": "Los Angeles, CA",
        "address": "567 Spring Street, Downtown Los Angeles, CA 90013",
        "size": 1950,
        "status": "rented",
        "bedrooms": 3,
        "bathrooms": 2.5,
        "year_built": 2020,
        "amenities": ["Gym", "Rooftop Terrace", "Concierge", "Smart Home", "Parking", "24/7 Security"],
        "description": "Luxury 3-bedroom loft in historic Downtown Los Angeles with exposed brick, high ceilings, and modern finishes.",
        "lat": 34.0628,
        "lng": -118.2467,
    },
    {
        "id": "3",
        "name": "Hollywood Heights Contemporary",
        "type": "apartment",
        "price": 3200,
        "location": "Los Angeles, CA",
        "address": "789 Hollywood Boulevard, Los Angeles, CA 90028",
        "size": 1600,
        "status": "available",
        "bedrooms": 2,
        "bathrooms": 2,
        "year_built": 2021,
        "amenities": ["Parking", "Fitness Center", "Pool", "Pet Friendly", "Smart Locks", "Security"],
        "description": "Modern 2-bedroom apartment in vibrant Hollywood with contemporary architecture and sleek design.",
        "lat": 34.1022,
        "lng": -118.3272,
    },
    {
        "id": "4",
        "name": "Santa Monica Beach Residences",
        "type": "apartment",
        "price": 4200,
        "location": "Los Angeles, CA",
        "address": "456 Ocean Park Boulevard, Santa Monica, CA 90405",
        "size": 1750,
        "status": "available",
        "bedrooms": 3,
        "bathrooms": 2,
        "year_built": 2022,
        "amenities": ["Ocean View", "Rooftop Deck", "Fitness Center", "Parking", "Pet Policy", "Concierge"],
        "description": "Beautiful 3-bedroom apartment in prime Santa Monica location just steps from the beach.",
        "lat": 34.0157,
        "lng": -118.4944,
    },
    {
        "id": "5",
        "name": "Beverly Hills Luxury Tower",
        "type": "apartment",
        "price": 5500,
        "location": "Los Angeles, CA",
        "address": "321 Wilshire Boulevard, Beverly Hills, CA 90210",
        "size": 2200,
        "status": "available",
        "bedrooms": 3,
        "bathrooms": 3,
        "year_built": 2023,
        "amenities": ["Valet Parking", "Spa", "Wine Cellar", "Concierge", "Security", "Rooftop Garden"],
        "description": "Prestigious 3-bedroom penthouse-style apartment in iconic Beverly Hills tower.",
        "lat": 34.0728,
        "lng": -118.3989,
    },
    {
        "id": "6",
        "name": "Culver City Modern Lofts",
        "type": "apartment",
        "price": 2400,
        "location": "Los Angeles, CA",
        "address": "123 Washington Boulevard, Culver City, CA 90232",
        "size": 1350,
        "status": "rented",
        "bedrooms": 1,
        "bathrooms": 1.5,
        "year_built": 2018,
        "amenities": ["Parking", "Gym", "Laundry", "Pet Friendly", "Community Room"],
        "description": "Stylish 1-bedroom loft in trendy Culver City with open floor plan and industrial-chic design.",
        "lat": 34.0084,
        "lng": -118.3999,
    },
    {
        "id": "7",
        "name": "Koreatown Urban Living",
        "type": "apartment",
        "price": 2100,
        "location": "Los Angeles, CA",
        "address": "987 Wilshire Boulevard, Koreatown, CA 90005",
        "size": 1200,
        "status": "available",
        "bedrooms": 2,
        "bathrooms": 1,
        "year_built": 2017,
        "amenities": ["Parking", "Gym", "Rooftop", "Pet Policy", "Doorman"],
        "description": "Contemporary 2-bedroom apartment in vibrant Koreatown with modern amenities and convenient location.",
        "lat": 34.0699,
        "lng": -118.2968,
    },
    {
        "id": "8",
        "name": "Weho Modern Residences",
        "type": "apartment",
        "price": 3800,
        "location": "Los Angeles, CA",
        "address": "654 Larrabee Street, West Hollywood, CA 90048",
        "size": 1850,
        "status": "available",
        "bedrooms": 2,
        "bathrooms": 2.5,
        "year_built": 2020,
        "amenities": ["Rooftop Lounge", "Parking", "Fitness Center", "Pet Friendly", "Security"],
        "description": "Sophisticated 2-bedroom apartment in prestigious West Hollywood with contemporary design.",
        "lat": 34.0816,
        "lng": -118.3733,
    },
]

# Mock Tenants Data
MOCK_TENANTS = [
    {
        "id": "1",
        "name": "Marcus Johnson",
        "email": "marcus.johnson@example.com",
        "phone": "(323) 555-0123",
        "property_id": "1",
        "lease_start_date": "2023-02-01",
        "lease_end_date": "2025-01-31",
        "monthly_rent": 2800,
    },
    {
        "id": "2",
        "name": "Emily Rodriguez",
        "email": "emily.rodriguez@example.com",
        "phone": "(213) 555-0456",
        "property_id": "2",
        "lease_start_date": "2023-06-15",
        "lease_end_date": "2025-06-14",
        "monthly_rent": 3500,
    },
    {
        "id": "3",
        "name": "David Chen",
        "email": "david.chen@example.com",
        "phone": "(310) 555-0789",
        "property_id": "6",
        "lease_start_date": "2023-09-01",
        "lease_end_date": "2025-08-31",
        "monthly_rent": 2400,
    },
]

# Mock Payments Data
MOCK_PAYMENTS = [
    {
        "id": "P-LSB-001",
        "tenant_id": "1",
        "property_id": "1",
        "amount": 2800,
        "due_date": "2024-02-01",
        "paid_date": "2024-02-01",
        "status": "paid",
    },
    {
        "id": "P-LSB-002",
        "tenant_id": "1",
        "property_id": "1",
        "amount": 2800,
        "due_date": "2024-03-01",
        "paid_date": "2024-03-02",
        "status": "paid",
    },
    {
        "id": "P-LSB-003",
        "tenant_id": "1",
        "property_id": "1",
        "amount": 2800,
        "due_date": "2024-04-01",
        "paid_date": None,
        "status": "pending",
    },
    {
        "id": "P-LSB-004",
        "tenant_id": "1",
        "property_id": "1",
        "amount": 2800,
        "due_date": "2024-05-01",
        "paid_date": None,
        "status": "pending",
    },
    {
        "id": "P-LSB-005",
        "tenant_id": "2",
        "property_id": "2",
        "amount": 3500,
        "due_date": "2024-02-15",
        "paid_date": "2024-02-15",
        "status": "paid",
    },
    {
        "id": "P-LSB-006",
        "tenant_id": "2",
        "property_id": "2",
        "amount": 3500,
        "due_date": "2024-03-15",
        "paid_date": "2024-03-15",
        "status": "paid",
    },
    {
        "id": "P-LSB-007",
        "tenant_id": "2",
        "property_id": "2",
        "amount": 3500,
        "due_date": "2024-04-15",
        "paid_date": None,
        "status": "pending",
    },
    {
        "id": "P-LSB-008",
        "tenant_id": "2",
        "property_id": "2",
        "amount": 3500,
        "due_date": "2024-05-15",
        "paid_date": None,
        "status": "pending",
    },
    {
        "id": "P-LSB-009",
        "tenant_id": "3",
        "property_id": "6",
        "amount": 2400,
        "due_date": "2024-02-01",
        "paid_date": "2024-02-01",
        "status": "paid",
    },
    {
        "id": "P-LSB-010",
        "tenant_id": "3",
        "property_id": "6",
        "amount": 2400,
        "due_date": "2024-03-01",
        "paid_date": "2024-03-01",
        "status": "paid",
    },
    {
        "id": "P-LSB-011",
        "tenant_id": "3",
        "property_id": "6",
        "amount": 2400,
        "due_date": "2024-04-01",
        "paid_date": None,
        "status": "pending",
    },
]

# Mock Invoices Data
MOCK_INVOICES = [
    {
        "id": "INV-LSB-001",
        "payment_id": "P-LSB-001",
        "tenant_id": "1",
        "property_id": "1",
        "amount": 2800,
        "issue_date": "2024-04-01",
        "due_date": "2024-05-01",
        "description": "Monthly Rent - Sunset Hills Luxury Apartments",
        "generated_at": "2024-04-01",
    },
    {
        "id": "INV-LSB-002",
        "payment_id": "P-LSB-002",
        "tenant_id": "1",
        "property_id": "1",
        "amount": 2800,
        "issue_date": "2024-03-01",
        "due_date": "2024-04-01",
        "description": "Monthly Rent - Sunset Hills Luxury Apartments",
        "generated_at": "2024-03-01",
    },
    {
        "id": "INV-LSB-003",
        "payment_id": "P-LSB-005",
        "tenant_id": "2",
        "property_id": "2",
        "amount": 3500,
        "issue_date": "2024-04-01",
        "due_date": "2024-05-01",
        "description": "Monthly Rent - Downtown LA Premium Lofts",
        "generated_at": "2024-04-01",
    },
    {
        "id": "INV-LSB-004",
        "payment_id": "P-LSB-009",
        "tenant_id": "3",
        "property_id": "6",
        "amount": 2400,
        "issue_date": "2024-04-01",
        "due_date": "2024-05-01",
        "description": "Monthly Rent - Culver City Modern Lofts",
        "generated_at": "2024-04-01",
    },
]


def get_properties() -> List[Dict[str, Any]]:
    """Get all properties."""
    return MOCK_PROPERTIES


def get_property(property_id: str) -> Dict[str, Any]:
    """Get a specific property by ID."""
    return next((p for p in MOCK_PROPERTIES if p["id"] == property_id), None)


def get_tenants() -> List[Dict[str, Any]]:
    """Get all tenants."""
    return MOCK_TENANTS


def get_tenant(tenant_id: str) -> Dict[str, Any]:
    """Get a specific tenant by ID."""
    return next((t for t in MOCK_TENANTS if t["id"] == tenant_id), None)


def get_payments() -> List[Dict[str, Any]]:
    """Get all payments."""
    return MOCK_PAYMENTS


def get_invoices() -> List[Dict[str, Any]]:
    """Get all invoices."""
    return MOCK_INVOICES


def get_payment_stats() -> Dict[str, Any]:
    """Get payment statistics."""
    payments = get_payments()
    paid = [p for p in payments if p["status"] == "paid"]
    pending = [p for p in payments if p["status"] == "pending"]
    overdue = [p for p in payments if p["status"] == "overdue"]
    
    return {
        "total_payments": len(payments),
        "paid_count": len(paid),
        "pending_count": len(pending),
        "overdue_count": len(overdue),
        "total_paid": sum(p["amount"] for p in paid),
        "total_pending": sum(p["amount"] for p in pending),
        "total_overdue": sum(p["amount"] for p in overdue),
    }


def get_property_stats() -> Dict[str, Any]:
    """Get property statistics."""
    properties = get_properties()
    rented = [p for p in properties if p["status"] == "rented"]
    available = [p for p in properties if p["status"] == "available"]
    maintenance = [p for p in properties if p["status"] == "maintenance"]
    
    total_monthly_revenue = sum(p["price"] for p in rented)
    
    return {
        "total_properties": len(properties),
        "rented_count": len(rented),
        "available_count": len(available),
        "maintenance_count": len(maintenance),
        "occupancy_rate": round((len(rented) / len(properties) * 100), 1) if properties else 0,
        "total_monthly_revenue": total_monthly_revenue,
        "average_rent": round(sum(p["price"] for p in properties) / len(properties), 2) if properties else 0,
    }


def get_revenue_trends() -> List[Dict[str, Any]]:
    """Get revenue trends by month."""
    return [
        {"month": "Jan", "rental_income": 10500, "total_revenue": 55500},
        {"month": "Feb", "rental_income": 12800, "total_revenue": 62800},
        {"month": "Mar", "rental_income": 15300, "total_revenue": 70300},
        {"month": "Apr", "rental_income": 14200, "total_revenue": 62200},
        {"month": "May", "rental_income": 17600, "total_revenue": 79600},
        {"month": "Jun", "rental_income": 19500, "total_revenue": 89500},
    ]
