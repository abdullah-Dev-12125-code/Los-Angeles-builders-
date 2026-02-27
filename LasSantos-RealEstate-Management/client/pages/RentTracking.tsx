import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockPayments, mockTenants, mockProperties } from "@/lib/mock-data";
import { AlertCircle, CheckCircle, Clock, DollarSign } from "lucide-react";

export default function RentTracking() {
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "tenant">("date");

  // Get tenant name by ID
  const getTenantName = (tenantId: string) => {
    return mockTenants.find((t) => t.id === tenantId)?.name || "Unknown";
  };

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    return mockProperties.find((p) => p.id === propertyId)?.name || "Unknown";
  };

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let filtered = mockPayments;

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortBy === "amount") {
        return b.amount - a.amount;
      } else if (sortBy === "tenant") {
        return getTenantName(a.tenantId).localeCompare(getTenantName(b.tenantId));
      }
      return 0;
    });

    return filtered;
  }, [filterStatus, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const paid = mockPayments.filter((p) => p.status === "paid");
    const pending = mockPayments.filter((p) => p.status === "pending");
    const overdue = mockPayments.filter((p) => p.status === "overdue");

    return {
      totalPayments: mockPayments.length,
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
      totalAmount: mockPayments.reduce((sum, p) => sum + p.amount, 0),
      paidAmount: paid.reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
      overdueAmount: overdue.reduce((sum, p) => sum + p.amount, 0),
    };
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rent Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Monitor payment status and manage overdue payments
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  ${(stats.totalAmount / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalPayments} payments
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Paid */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${(stats.paidAmount / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.paidCount} payments
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Pending */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  ${(stats.pendingAmount / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.pendingCount} payments
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          {/* Overdue */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  ${(stats.overdueAmount / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.overdueCount} payments
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex gap-2">
              {["all", "paid", "pending", "overdue"].map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  variant={filterStatus === status ? "default" : "outline"}
                  className={
                    filterStatus === status
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:bg-secondary"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            <div className="md:ml-auto">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="date">Due Date</option>
                <option value="amount">Amount</option>
                <option value="tenant">Tenant Name</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Payments Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary border-b border-border">
                  <TableHead className="text-foreground font-semibold">Tenant</TableHead>
                  <TableHead className="text-foreground font-semibold">Property</TableHead>
                  <TableHead className="text-foreground font-semibold">Amount</TableHead>
                  <TableHead className="text-foreground font-semibold">Due Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Paid Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-b border-border hover:bg-secondary/50">
                    <TableCell className="font-medium text-foreground">
                      {getTenantName(payment.tenantId)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {getPropertyName(payment.propertyId)}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      ${payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDate(payment.dueDate)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {payment.paidDate ? formatDate(payment.paidDate) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <Badge className={getStatusBadge(payment.status)}>
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:bg-secondary"
                      >
                        {payment.status === "overdue" ? "Send Reminder" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {filteredPayments.length === 0 && (
            <div className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No payments found
              </h3>
              <p className="text-muted-foreground">
                Adjust your filters to see more payments
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
