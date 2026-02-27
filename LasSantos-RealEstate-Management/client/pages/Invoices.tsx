import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockInvoices, mockTenants, mockProperties } from "@/lib/mock-data";
import { FileText, Download, Eye, Plus, X } from "lucide-react";

export default function Invoices() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [formData, setFormData] = useState({
    tenantId: "",
    propertyId: "",
    description: "",
    amount: "",
  });

  // Get tenant name by ID
  const getTenantName = (tenantId: string) => {
    return mockTenants.find((t) => t.id === tenantId)?.name || "Unknown";
  };

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    return mockProperties.find((p) => p.id === propertyId)?.name || "Unknown";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Download invoice as PDF (simulated)
  const downloadInvoice = (invoice: any) => {
    alert(`Downloading invoice ${invoice.id}. In production, this would generate a PDF.`);
  };

  // Generate new invoice
  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenantId || !formData.propertyId || !formData.description || !formData.amount) {
      alert("Please fill in all fields");
      return;
    }

    const newInvoice = {
      id: `INV-${String(invoices.length + 1).padStart(4, "0")}`,
      tenantId: formData.tenantId,
      propertyId: formData.propertyId,
      description: formData.description,
      amount: parseFloat(formData.amount),
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "pending",
    };

    setInvoices([...invoices, newInvoice]);
    setFormData({ tenantId: "", propertyId: "", description: "", amount: "" });
    setShowGenerateForm(false);
    alert(`Invoice ${newInvoice.id} created successfully!`);
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices & Receipts</h1>
            <p className="text-muted-foreground mt-1">
              View, generate, and download all invoices and payment receipts
            </p>
          </div>
          <Button
            onClick={() => setShowGenerateForm(true)}
            className="bg-primary text-primary-foreground hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(invoices.reduce((sum, inv) => sum + inv.amount, 0))}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(
                    invoices
                      .filter((inv) => {
                        const invDate = new Date(inv.issueDate);
                        const now = new Date();
                        return (
                          invDate.getMonth() === now.getMonth() &&
                          invDate.getFullYear() === now.getFullYear()
                        );
                      })
                      .reduce((sum, inv) => sum + inv.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary border-b border-border">
                  <TableHead className="text-foreground font-semibold">Invoice ID</TableHead>
                  <TableHead className="text-foreground font-semibold">Tenant</TableHead>
                  <TableHead className="text-foreground font-semibold">Property</TableHead>
                  <TableHead className="text-foreground font-semibold">Amount</TableHead>
                  <TableHead className="text-foreground font-semibold">Issue Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Due Date</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-b border-border hover:bg-secondary/50">
                    <TableCell className="font-semibold text-primary">{invoice.id}</TableCell>
                    <TableCell className="text-foreground">
                      {getTenantName(invoice.tenantId)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {getPropertyName(invoice.propertyId)}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDate(invoice.issueDate)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedInvoice(invoice)}
                          className="text-primary hover:bg-secondary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadInvoice(invoice)}
                          className="text-primary hover:bg-secondary"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Invoice Preview Modal */}
        {selectedInvoice && (
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-2xl mx-auto">
              {/* Invoice Header */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">INVOICE</h2>
                  <p className="text-lg font-semibold text-primary mt-1">
                    {selectedInvoice.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedInvoice(null)}
                  className="text-foreground"
                >
                  ✕ Close
                </Button>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    BILL FROM
                  </h3>
                  <p className="font-semibold text-foreground">RealEstate Property Management</p>
                  <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    BILL TO
                  </h3>
                  <p className="font-semibold text-foreground">
                    {getTenantName(selectedInvoice.tenantId)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getPropertyName(selectedInvoice.propertyId)}
                  </p>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-b border-border">
                      <th className="text-left py-3 text-sm font-semibold text-foreground">
                        Description
                      </th>
                      <th className="text-right py-3 text-sm font-semibold text-foreground">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 text-foreground">{selectedInvoice.description}</td>
                      <td className="text-right py-3 text-foreground">
                        {formatCurrency(selectedInvoice.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-48">
                  <div className="flex justify-between py-2 border-t-2 border-foreground">
                    <span className="font-semibold text-foreground">TOTAL DUE:</span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(selectedInvoice.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-8 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
                  <p className="font-semibold text-foreground">
                    {formatDate(selectedInvoice.issueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="font-semibold text-foreground">
                    {formatDate(selectedInvoice.dueDate)}
                  </p>
                </div>
              </div>

              {/* Print Button */}
              <div className="mt-8 flex gap-3">
                <Button
                  onClick={() => downloadInvoice(selectedInvoice)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex-1 border-border text-foreground hover:bg-secondary"
                >
                  Print
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Generate Invoice Modal */}
        {showGenerateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 animate-scaleIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Generate Invoice</h2>
                <button
                  onClick={() => setShowGenerateForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGenerateInvoice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Tenant
                  </label>
                  <select
                    value={formData.tenantId}
                    onChange={(e) =>
                      setFormData({ ...formData, tenantId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a tenant...</option>
                    {mockTenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Property
                  </label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) =>
                      setFormData({ ...formData, propertyId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a property...</option>
                    {mockProperties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Monthly Rent"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-blue-700"
                  >
                    Create Invoice
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGenerateForm(false)}
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
