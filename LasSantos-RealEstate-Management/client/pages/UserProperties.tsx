import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTenants, mockProperties } from "@/lib/mock-data";
import { 
  MapPin, 
  Home, 
  Users, 
  Zap, 
  Droplet, 
  Wind, 
  Wifi,
  Phone,
  MessageSquare,
  Star,
  ChevronRight
} from "lucide-react";

export default function UserProperties() {
  // Get current tenant
  const currentTenant = mockTenants[0];
  const property = mockProperties.find((p) => p.id === currentTenant.propertyId);

  if (!property) {
    return (
      <Layout userType="user">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Property Found
            </h3>
            <p className="text-muted-foreground">
              You don't have any assigned properties yet.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="user">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Property</h1>
          <p className="text-muted-foreground mt-1">
            View detailed information about your rental property
          </p>
        </div>

        {/* Property Hero */}
        <Card className="overflow-hidden animate-scaleIn">
          <div className="relative h-96 w-full overflow-hidden bg-muted group">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-2">{property.name}</h2>
                <div className="flex items-center gap-2 text-gray-200">
                  <MapPin className="w-5 h-5" />
                  {property.address}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Type */}
          <Card className="p-6 animate-stagger-1 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                <p className="text-lg font-semibold text-foreground capitalize">{property.type}</p>
              </div>
            </div>
          </Card>

          {/* Bedrooms */}
          {property.bedrooms && (
            <Card className="p-6 animate-stagger-2 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bedrooms</p>
                  <p className="text-lg font-semibold text-foreground">{property.bedrooms}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Bathrooms */}
          {property.bathrooms && (
            <Card className="p-6 animate-stagger-3 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Droplet className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bathrooms</p>
                  <p className="text-lg font-semibold text-foreground">{property.bathrooms}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Size */}
          <Card className="p-6 animate-stagger-4 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wind className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Size</p>
                <p className="text-lg font-semibold text-foreground">
                  {property.size.toLocaleString()} sqft
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {property.description && (
              <Card className="p-6 animate-stagger-1">
                <h3 className="text-lg font-semibold text-foreground mb-3">About This Property</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </Card>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="p-6 animate-stagger-2">
                <h3 className="text-lg font-semibold text-foreground mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Year Built */}
            {property.yearBuilt && (
              <Card className="p-6 animate-stagger-3">
                <h3 className="text-lg font-semibold text-foreground mb-3">Additional Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <p className="text-muted-foreground">Year Built</p>
                    <p className="font-semibold text-foreground">{property.yearBuilt}</p>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{property.location}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="bg-blue-100 text-blue-700">Occupied</Badge>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="p-6 animate-stagger-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Phone className="w-4 h-4" />
                  Call Landlord
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Wifi className="w-4 h-4" />
                  Report Issue
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 animate-stagger-3">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors flex items-center justify-between group">
                  <span className="text-foreground font-medium">View Lease</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors flex items-center justify-between group">
                  <span className="text-foreground font-medium">Payment History</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors flex items-center justify-between group">
                  <span className="text-foreground font-medium">Maintenance Requests</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                </button>
              </div>
            </Card>

            {/* Property Gallery */}
            {property.images && property.images.length > 0 && (
              <Card className="p-6 animate-stagger-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Photo Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden cursor-pointer group">
                      <img
                        src={image}
                        alt={`Property view ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
