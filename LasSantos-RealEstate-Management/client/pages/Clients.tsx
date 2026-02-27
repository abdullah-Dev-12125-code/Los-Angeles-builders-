import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockClients } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { Plus, Edit2, Trash2, Search, DollarSign, Users } from "lucide-react";

export default function Clients() {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active" as "active" | "inactive" | "cold",
  });

  const filteredClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  const handleAddClient = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setToast({ type: "error", title: "Validation Error", message: "Please fill in all required fields" });
      return;
    }

    if (editingId) {
      // Update existing client
      setClients(
        clients.map((c) =>
          c.id === editingId
            ? { ...c, ...formData, lastContact: new Date().toISOString().split("T")[0] }
            : c
        )
      );
      setToast({ type: "success", title: "Client Updated", message: "Client information has been updated successfully" });
    } else {
      // Add new client
      const newClient = {
        id: "C" + Date.now(),
        ...formData,
        interestedProperties: [],
        totalDeals: 0,
        totalSpent: 0,
        dateAdded: new Date().toISOString().split("T")[0],
      };
      setClients([...clients, newClient]);
      setToast({ type: "success", title: "Client Added", message: `${formData.name} has been added as a new client` });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (client: any) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address || "",
      status: client.status,
    });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      const clientName = clients.find((c) => c.id === deleteId)?.name;
      setClients(clients.filter((c) => c.id !== deleteId));
      setToast({ type: "success", title: "Client Deleted", message: `${clientName} has been removed from your contacts` });
      setDeleteId(null);
    }
  };

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">
              Manage your client relationships and deal history
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="gap-2 shadow-lg animate-slideUp"
          >
            <Plus className="w-5 h-5" />
            Add Client
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 animate-slideUp hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 animate-slideUp hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-3xl font-bold text-teal-600">{stats.active}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 animate-slideUp hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-cyan-600">
                  ${(stats.totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 animate-slideUp">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editingId ? "Edit Client" : "Add New Client"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground font-medium">Full Name *</Label>
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-foreground font-medium">Email *</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-foreground font-medium">Phone *</Label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-foreground font-medium">Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="cold">Cold Lead</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-foreground font-medium">Address</Label>
                <Input
                  placeholder="Street address, city, state ZIP"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddClient}
                className="flex-1 shadow-md"
              >
                {editingId ? "Update Client" : "Add Client"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Clients Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary border-b border-border">
                  <TableHead className="text-foreground font-semibold">Name</TableHead>
                  <TableHead className="text-foreground font-semibold">Email</TableHead>
                  <TableHead className="text-foreground font-semibold">Phone</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold">Deals</TableHead>
                  <TableHead className="text-foreground font-semibold">Total Spent</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <TableCell className="font-semibold text-foreground">
                      {client.name}
                    </TableCell>
                    <TableCell className="text-foreground">{client.email}</TableCell>
                    <TableCell className="text-foreground">{client.phone}</TableCell>
                    <TableCell>
                      <StatusBadge status={client.status} type="client" />
                    </TableCell>
                    <TableCell className="text-foreground">{client.totalDeals}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      ${client.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(client)}
                          className="text-primary hover:bg-secondary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(client.id)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No clients found
              </h3>
              <p className="text-muted-foreground">
                Start by adding your first client to track deals and relationships
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </Layout>
  );
}
