import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockTenants, mockProperties } from "@/lib/mock-data";
import {
  Mail,
  Phone,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Users,
} from "lucide-react";

interface TenantFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyRent: number;
}

export default function Tenants() {
  const [tenants, setTenants] = useState(mockTenants);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rent" | "lease">("name");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TenantFormData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    propertyId: "",
    leaseStartDate: "",
    leaseEndDate: "",
    monthlyRent: 0,
  });

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    return mockProperties.find((p) => p.id === propertyId)?.name || "Unknown";
  };

  // Filter and sort tenants
  const filteredTenants = useMemo(() => {
    let filtered = tenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm),
    );

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "rent") {
        return b.monthlyRent - a.monthlyRent;
      } else if (sortBy === "lease") {
        return (
          new Date(a.leaseEndDate).getTime() -
          new Date(b.leaseEndDate).getTime()
        );
      }
      return 0;
    });

    return filtered;
  }, [tenants, searchTerm, sortBy]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get lease status
  const getLeaseStatus = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysLeft < 0)
      return { label: "Expired", color: "bg-red-100 text-red-700" };
    if (daysLeft < 30)
      return { label: "Expiring Soon", color: "bg-orange-100 text-orange-700" };
    return { label: "Active", color: "bg-green-100 text-green-700" };
  };

  // Handle open form for adding new tenant
  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      id: `T${Date.now()}`,
      name: "",
      email: "",
      phone: "",
      propertyId: "",
      leaseStartDate: "",
      leaseEndDate: "",
      monthlyRent: 0,
    });
    setShowForm(true);
  };

  // Handle edit tenant
  const handleEditClick = (tenant: TenantFormData) => {
    setEditingId(tenant.id);
    setFormData(tenant);
    setShowForm(true);
  };

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.propertyId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      alert("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    if (new Date(formData.leaseStartDate) >= new Date(formData.leaseEndDate)) {
      alert("Lease end date must be after lease start date");
      return;
    }

    if (editingId) {
      // Update existing tenant
      setTenants(tenants.map((t) => (t.id === editingId ? formData : t)));
    } else {
      // Add new tenant
      setTenants([...tenants, formData]);
    }

    setShowForm(false);
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      propertyId: "",
      leaseStartDate: "",
      leaseEndDate: "",
      monthlyRent: 0,
    });
  };

  // Handle delete tenant
  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      setTenants(tenants.filter((t) => t.id !== id));
    }
  };

  // Handle reset form
  const handleResetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      propertyId: "",
      leaseStartDate: "",
      leaseEndDate: "",
      monthlyRent: 0,
    });
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-slideDown">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tenants</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your tenants and their lease agreements
            </p>
          </div>
          <Button className="gap-2 shadow-lg" onClick={handleAddClick}>
            <Plus className="w-4 h-4" />
            Add Tenant
          </Button>
        </div>

        {/* Search and Filter */}
        <Card
          className="p-4 animate-slideDown"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search Tenants
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Name</option>
                <option value="rent">Monthly Rent</option>
                <option value="lease">Lease End Date</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Tenants Table */}
        <Card
          className="overflow-hidden animate-slideDown"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary border-b border-border">
                  <TableHead className="text-foreground font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Property
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Contact
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Rent
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Lease
                  </TableHead>
                  <TableHead className="text-foreground font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant, index) => {
                  const status = getLeaseStatus(tenant.leaseEndDate);
                  return (
                    <TableRow
                      key={tenant.id}
                      className="border-b border-border hover:bg-secondary/50 animate-slideDown"
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <TableCell className="font-medium text-foreground">
                        {tenant.name}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {getPropertyName(tenant.propertyId)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {tenant.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            {tenant.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        ${tenant.monthlyRent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        <div>
                          {formatDate(tenant.leaseStartDate)} to{" "}
                          {formatDate(tenant.leaseEndDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditClick(tenant)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit2 className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(tenant.id)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {filteredTenants.length === 0 && (
            <div className="p-8 text-center animate-fadeIn">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No tenants found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 animate-stagger-1 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Tenants
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {filteredTenants.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 animate-stagger-2 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Monthly Income
                </p>
                <p className="text-3xl font-bold text-primary mt-1">
                  $
                  {filteredTenants
                    .reduce((sum, t) => sum + t.monthlyRent, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 animate-stagger-3 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Active Leases
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {
                    filteredTenants.filter(
                      (t) => getLeaseStatus(t.leaseEndDate).label === "Active",
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add/Edit Tenant Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <Card className="w-full max-w-2xl p-8 animate-scaleIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingId ? "Edit Tenant" : "Add New Tenant"}
                </h2>
                <button
                  onClick={handleResetForm}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Property and Monthly Rent */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Property *
                    </label>
                    <select
                      value={formData.propertyId}
                      onChange={(e) =>
                        setFormData({ ...formData, propertyId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select a property</option>
                      {mockProperties.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                          {prop.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Monthly Rent *
                    </label>
                    <Input
                      type="number"
                      placeholder="2500"
                      value={formData.monthlyRent || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monthlyRent: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Lease Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Lease Start Date
                    </label>
                    <Input
                      type="date"
                      value={formData.leaseStartDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leaseStartDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Lease End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.leaseEndDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          leaseEndDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    {editingId ? "Update Tenant" : "Add Tenant"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetForm}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
