import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockProperties } from "@/lib/mock-data";
import { fetchProperties, type ApiProperty } from "@/lib/api";
import {
  MapPin,
  Square,
  Home,
  Plus,
  Edit2,
  Heart,
  X,
  AlertCircle,
} from "lucide-react";

interface PropertyFormData {
  name: string;
  type: "apartment" | "house" | "commercial" | "land";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  size: number;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt: number;
  status: "available" | "rented" | "maintenance";
  image: string;
  description: string;
  parcelNumber: string;
  buildingPermit: string;
  certificateOfOccupancy: string;
  zoningClassification: string;
  hoaName?: string;
  titleVerification: string;
  amenities: string;
}

const initialFormData: PropertyFormData = {
  name: "",
  type: "apartment",
  address: "",
  city: "Los Angeles",
  state: "CA",
  zipCode: "",
  size: 0,
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  yearBuilt: new Date().getFullYear(),
  status: "available",
  image: "",
  description: "",
  parcelNumber: "",
  buildingPermit: "",
  certificateOfOccupancy: "",
  zoningClassification: "",
  hoaName: "",
  titleVerification: "",
  amenities: "",
};

const fallbackImage =
  mockProperties[0]?.image ??
  "https://images.pexels.com/photos/21071043/pexels-photo-21071043.jpeg";

const mapApiProperty = (property: ApiProperty) => {
  const match = mockProperties.find(
    (item) => item.name === property.name || item.id === String(property.id),
  );
  const location =
    [property.city, property.state].filter(Boolean).join(", ") ||
    match?.location ||
    property.address ||
    "Los Angeles, CA";
  const image = match?.image ?? fallbackImage;
  const images = match?.images ?? [image];

  return {
    id: String(property.id),
    name: property.name,
    type: match?.type ?? "apartment",
    price: Number(property.price ?? 0),
    location,
    address: property.address ?? "",
    size: Number(property.size ?? 0),
    status: property.status ?? "available",
    image,
    images,
    bedrooms: property.bedrooms ?? match?.bedrooms,
    bathrooms: property.bathrooms ?? match?.bathrooms,
    yearBuilt: property.year_built ?? match?.yearBuilt,
    amenities: match?.amenities ?? [],
    description: property.description ?? match?.description ?? "",
    lat: match?.lat,
    lng: match?.lng,
    tenantId: match?.tenantId,
    isFavorite: false,
  };
};

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState<"price" | "size" | "name">("name");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [properties, setProperties] = useState(mockProperties);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchProperties();
        const mapped = data.map((property) => mapApiProperty(property));
        if (isMounted && mapped.length > 0) {
          setProperties(mapped);
          setApiError(null);
        }
      } catch (error) {
        if (isMounted) {
          setApiError("Using local data. API is not available.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Get unique locations
  const locations = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.location)));
  }, [properties]);

  // Get price range from data
  const priceRange = useMemo(() => {
    const prices = properties.map((p) => p.price);
    return {
      min: 0,
      max: Math.max(...prices) + 1000,
    };
  }, [properties]);

  // Get size range from data
  const sizeRange = useMemo(() => {
    const sizes = properties.map((p) => p.size);
    return {
      min: 0,
      max: Math.max(...sizes) + 1000,
    };
  }, [properties]);

  const [maxPrice, setMaxPrice] = useState(priceRange.max);
  const [maxSize, setMaxSize] = useState(sizeRange.max);

  useEffect(() => {
    setMaxPrice((prev) => (prev === 0 || prev < priceRange.max ? priceRange.max : prev));
  }, [priceRange.max]);

  useEffect(() => {
    setMaxSize((prev) => (prev === 0 || prev < sizeRange.max ? sizeRange.max : prev));
  }, [sizeRange.max]);

  // Get unique types
  const types = ["apartment", "house", "commercial", "land"];

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate ZIP code format
  const isValidZipCode = (zipCode: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) errors.name = "Property name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required";
    else if (!isValidZipCode(formData.zipCode))
      errors.zipCode = "Invalid ZIP code format (use XXXXX or XXXXX-XXXX)";

    if (formData.price <= 0) errors.price = "Price must be greater than 0";
    if (formData.size <= 0) errors.size = "Size must be greater than 0";
    if (formData.type === "apartment" || formData.type === "house") {
      if (!formData.bedrooms || formData.bedrooms <= 0)
        errors.bedrooms = "Bedrooms required";
      if (!formData.bathrooms || formData.bathrooms <= 0)
        errors.bathrooms = "Bathrooms required";
    }

    // Legal requirements - all required
    if (!formData.parcelNumber.trim())
      errors.parcelNumber = "Parcel/Tax ID is required";
    if (!formData.buildingPermit.trim())
      errors.buildingPermit = "Building permit number is required";
    if (!formData.certificateOfOccupancy.trim())
      errors.certificateOfOccupancy = "Certificate of Occupancy is required";
    if (!formData.zoningClassification.trim())
      errors.zoningClassification = "Zoning classification is required";
    if (!formData.titleVerification.trim())
      errors.titleVerification = "Title verification is required";
    if (!formData.description.trim())
      errors.description = "Property description is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send to backend
      console.log("Property added:", formData);
      alert(`Property "${formData.name}" added successfully!`);
      setFormData(initialFormData);
      setShowAddProperty(false);
    }
  };

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "all" || property.type === selectedType;
      const matchesPrice = property.price >= 0 && property.price <= maxPrice;
      const matchesLocation =
        selectedLocation === "all" || property.location === selectedLocation;
      const matchesSize = property.size >= 0 && property.size <= maxSize;

      return (
        matchesSearch &&
        matchesType &&
        matchesPrice &&
        matchesLocation &&
        matchesSize
      );
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "size") return a.size - b.size;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [properties, searchTerm, selectedType, maxPrice, selectedLocation, maxSize, sortBy]);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "rented":
        return "bg-blue-100 text-blue-700";
      case "available":
        return "bg-green-100 text-green-700";
      case "maintenance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const toggleFavorite = (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Properties</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all your Los Angeles properties by Los Santos
              Builders
            </p>
          </div>
          <Button
            onClick={() => setShowAddProperty(true)}
            className="gap-2 shadow-lg bg-primary hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </Button>
        </div>

        {isLoading && (
          <div className="text-sm text-muted-foreground">
            Loading properties from API...
          </div>
        )}
        {apiError && (
          <div className="text-sm text-orange-600">{apiError}</div>
        )}

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search
              </label>
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Property Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Location
              </label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </Select>
            </div>

            {/* Max Price */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Max Price (${maxPrice.toLocaleString()})
              </label>
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(parseInt(e.target.value) || priceRange.max)
                }
                max={priceRange.max}
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sort By
              </label>
              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val as any)}
              >
                <option value="name">Name</option>
                <option value="price">Price (Low to High)</option>
                <option value="size">Size (Small to Large)</option>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredProperties.length} of {properties.length}{" "}
            properties
          </div>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              className="block"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
                {/* Image */}
                <div className="relative h-48 bg-muted overflow-hidden group">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${getStatusColor(property.status)}`}
                  >
                    {getStatusLabel(property.status)}
                  </Badge>
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, property.id)}
                    className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(property.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {property.type}
                      </p>
                    </div>
                    {property.bedrooms && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Bedrooms
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {property.bedrooms}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="text-sm font-medium text-foreground">
                        {(property.size / 1000).toFixed(1)}K sqft
                      </p>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Monthly Rent
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ${(property.price / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border hover:bg-secondary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <Card className="p-12 text-center">
            <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No properties found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl my-8 animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-border sticky top-0 bg-card z-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Add New Property
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete all required fields including legal documentation
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddProperty(false);
                  setFormErrors({});
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form
              onSubmit={handleAddProperty}
              className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              {/* Section: Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-primary rounded"></div>
                  <h3 className="text-lg font-bold text-foreground">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Property Name *
                    </label>
                    <Input
                      placeholder="e.g., Sunset Hills Luxury Apartments"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Property Type *
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(val) =>
                        setFormData({ ...formData, type: val as any })
                      }
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Address *
                    </label>
                    <Input
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className={formErrors.address ? "border-red-500" : ""}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      City *
                    </label>
                    <Input
                      placeholder="Los Angeles, CA"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      State *
                    </label>
                    <Input
                      placeholder="CA"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      ZIP Code *
                    </label>
                    <Input
                      placeholder="90210"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      className={formErrors.zipCode ? "border-red-500" : ""}
                    />
                    {formErrors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Property Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-primary rounded"></div>
                  <h3 className="text-lg font-bold text-foreground">
                    Property Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Size (sqft) *
                    </label>
                    <Input
                      type="number"
                      placeholder="1500"
                      value={formData.size || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          size: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={formErrors.size ? "border-red-500" : ""}
                    />
                    {formErrors.size && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.size}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Monthly Rent ($) *
                    </label>
                    <Input
                      type="number"
                      placeholder="2500"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={formErrors.price ? "border-red-500" : ""}
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Year Built
                    </label>
                    <Input
                      type="number"
                      placeholder="2023"
                      value={formData.yearBuilt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yearBuilt:
                            parseInt(e.target.value) ||
                            new Date().getFullYear(),
                        })
                      }
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>

                  {(formData.type === "apartment" ||
                    formData.type === "house") && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Bedrooms *
                        </label>
                        <Input
                          type="number"
                          placeholder="2"
                          value={formData.bedrooms || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bedrooms: parseInt(e.target.value) || 0,
                            })
                          }
                          className={
                            formErrors.bedrooms ? "border-red-500" : ""
                          }
                        />
                        {formErrors.bedrooms && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.bedrooms}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Bathrooms *
                        </label>
                        <Input
                          type="number"
                          placeholder="2"
                          step="0.5"
                          value={formData.bathrooms || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bathrooms: parseFloat(e.target.value) || 0,
                            })
                          }
                          className={
                            formErrors.bathrooms ? "border-red-500" : ""
                          }
                        />
                        {formErrors.bathrooms && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.bathrooms}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Status
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) =>
                        setFormData({ ...formData, status: val as any })
                      }
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section: Legal Requirements */}
              <div className="space-y-4 bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-900">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100">
                    Legal Requirements *
                  </h3>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                  All fields below are required for property listing and
                  compliance with Los Angeles real estate regulations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Property Tax ID / Parcel Number *
                    </label>
                    <Input
                      placeholder="e.g., 4234-024-089"
                      value={formData.parcelNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parcelNumber: e.target.value,
                        })
                      }
                      className={
                        formErrors.parcelNumber ? "border-red-500" : ""
                      }
                    />
                    {formErrors.parcelNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.parcelNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Building Permit Number *
                    </label>
                    <Input
                      placeholder="e.g., BP2023-001234"
                      value={formData.buildingPermit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buildingPermit: e.target.value,
                        })
                      }
                      className={
                        formErrors.buildingPermit ? "border-red-500" : ""
                      }
                    />
                    {formErrors.buildingPermit && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.buildingPermit}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Certificate of Occupancy (CO Number) *
                    </label>
                    <Input
                      placeholder="e.g., CO-2023-45678"
                      value={formData.certificateOfOccupancy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certificateOfOccupancy: e.target.value,
                        })
                      }
                      className={
                        formErrors.certificateOfOccupancy
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {formErrors.certificateOfOccupancy && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.certificateOfOccupancy}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Zoning Classification *
                    </label>
                    <Input
                      placeholder="e.g., RZ4, R4L, C2, etc."
                      value={formData.zoningClassification}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          zoningClassification: e.target.value,
                        })
                      }
                      className={
                        formErrors.zoningClassification ? "border-red-500" : ""
                      }
                    />
                    {formErrors.zoningClassification && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.zoningClassification}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      HOA Name (if applicable)
                    </label>
                    <Input
                      placeholder="Leave blank if no HOA"
                      value={formData.hoaName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, hoaName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Title Verification Status *
                    </label>
                    <Select
                      value={formData.titleVerification}
                      onValueChange={(val) =>
                        setFormData({ ...formData, titleVerification: val })
                      }
                    >
                      <option value="">Select status...</option>
                      <option value="clear">Clear Title</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending Verification</option>
                      <option value="insured">Insured Title</option>
                    </Select>
                    {formErrors.titleVerification && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.titleVerification}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Description & Amenities */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-primary rounded"></div>
                  <h3 className="text-lg font-bold text-foreground">
                    Description & Amenities
                  </h3>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Property Description *
                  </label>
                  <textarea
                    placeholder="Provide a detailed description of the property..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.description ? "border-red-500" : "border-border"}`}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Amenities (comma-separated)
                  </label>
                  <Input
                    placeholder="e.g., Gym, Parking, Pool, Pet Friendly"
                    value={formData.amenities}
                    onChange={(e) =>
                      setFormData({ ...formData, amenities: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Image URL
                  </label>
                  <Input
                    placeholder="https://example.com/property-image.jpg"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-border sticky bottom-0 bg-card">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddProperty(false);
                    setFormErrors({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Add Property
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </Layout>
  );
}
