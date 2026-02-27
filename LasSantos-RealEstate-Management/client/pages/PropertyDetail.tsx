import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProperties } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Heart, MapPin, Ruler, Calendar, Home } from "lucide-react";

export default function PropertyDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const property = mockProperties.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <Layout userType="admin">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Property not found</h2>
          <Button onClick={() => navigate("/properties")} className="mt-4">
            Back to Properties
          </Button>
        </div>
      </Layout>
    );
  }

  const images = property.images || [property.image];
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "rented":
        return "bg-green-100 text-green-700";
      case "available":
        return "bg-blue-100 text-blue-700";
      case "maintenance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/properties")}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Properties
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative bg-muted h-96 lg:h-[500px] flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                </button>

                {/* Status Badge */}
                <Badge className={`absolute top-4 left-4 ${getStatusColor(property.status)}`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </Badge>

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-4 bg-background border-t border-border flex gap-3 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Description */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
              <p className="text-foreground leading-relaxed">{property.description}</p>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <p className="text-sm text-muted-foreground mb-2">Monthly Rent</p>
              <p className="text-4xl font-bold text-primary mb-4">
                ${property.price.toLocaleString()}
              </p>
              <div className="flex gap-2">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-blue-700">
                  Contact
                </Button>
                <Button variant="outline" className="flex-1 border-border">
                  Schedule Tour
                </Button>
              </div>
            </Card>

            {/* Key Details */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Property Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {property.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="text-sm font-medium text-foreground">
                      {property.size.toLocaleString()} sqft
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{property.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Year Built</p>
                    <p className="text-sm font-medium text-foreground">{property.yearBuilt}</p>
                  </div>
                </div>

                {property.bedrooms && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bedrooms</p>
                    <p className="text-sm font-medium text-foreground">{property.bedrooms}</p>
                  </div>
                )}

                {property.bathrooms && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bathrooms</p>
                    <p className="text-sm font-medium text-foreground">{property.bathrooms}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Location Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">Coordinates</h3>
              <p className="text-sm text-muted-foreground">
                Lat: {property.lat?.toFixed(4)}, Lng: {property.lng?.toFixed(4)}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                For use with map integration
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
