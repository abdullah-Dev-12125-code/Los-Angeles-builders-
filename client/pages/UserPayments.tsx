import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockTenants, mockPayments } from "@/lib/mock-data";
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  Eye,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function UserPayments() {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const currentTenant = mockTenants[0];
  const tenantPayments = mockPayments.filter((p) => p.tenantId === currentTenant.id);

  // Calculate stats
  const totalPaid = tenantPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = tenantPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = tenantPayments
    .filter((p) => p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0);

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Layout userType="user">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment History</h1>
            <p className="text-muted-foreground mt-1">
              Track your rent payments, view receipts, and manage payment methods
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Make Payment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Paid */}
          <Card className="p-6 animate-stagger-1 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </Card>

          {/* Pending Amount */}
          <Card className="p-6 animate-stagger-2 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </Card>

          {/* Overdue Amount */}
          <Card className="p-6 animate-stagger-3 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalOverdue)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="overflow-hidden animate-stagger-1">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Visa Card */}
              <div className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Default</Badge>
                </div>
                <p className="text-foreground font-semibold mb-1">Visa Card</p>
                <p className="text-muted-foreground text-sm mb-3">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/25</p>
              </div>

              {/* Mastercard */}
              <div className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-foreground font-semibold mb-1">Mastercard</p>
                <p className="text-muted-foreground text-sm mb-3">•••• •••• •••• 5555</p>
                <p className="text-xs text-muted-foreground">Expires 08/26</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </Card>

        {/* Payment History */}
        <Card className="overflow-hidden animate-stagger-2">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Complete Payment History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary border-b border-border">
                  <TableHead className="text-foreground font-semibold">Payment ID</TableHead>
                  <TableHead className="text-foreground font-semibold">Amount</TableHead>
                  <TableHead className="text-foreground font-semibold">Due Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Paid Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantPayments.length > 0 ? (
                  tenantPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-b border-border hover:bg-secondary/50">
                      <TableCell className="font-semibold text-primary">{payment.id}</TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-foreground">{formatDate(payment.dueDate)}</TableCell>
                      <TableCell className="text-foreground">
                        {payment.paidDate ? formatDate(payment.paidDate) : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentStatusIcon(payment.status)}
                          <Badge className={getPaymentStatusColor(payment.status)}>
                            {getPaymentStatusLabel(payment.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No payments yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Payment Receipt Modal (if selected) */}
        {selectedPayment && (
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 animate-scaleIn">
            <div className="max-w-2xl">
              {/* Receipt Header */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">RECEIPT</h2>
                  <p className="text-lg font-semibold text-primary mt-1">
                    {selectedPayment.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPayment(null)}
                  className="text-foreground"
                >
                  ✕ Close
                </Button>
              </div>

              {/* Receipt Details */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    FROM
                  </h3>
                  <p className="font-semibold text-foreground">Property Management</p>
                  <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    TO
                  </h3>
                  <p className="font-semibold text-foreground">
                    {currentTenant.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentTenant.email}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex justify-end mb-8">
                <div className="w-48">
                  <div className="flex justify-between py-2 border-t-2 border-foreground">
                    <span className="font-semibold text-foreground">AMOUNT PAID:</span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(selectedPayment.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-8 p-4 bg-secondary rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="font-semibold text-foreground">
                    {formatDate(selectedPayment.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {selectedPayment.paidDate ? "Paid Date" : "Status"}
                  </p>
                  <p className="font-semibold text-foreground">
                    {selectedPayment.paidDate
                      ? formatDate(selectedPayment.paidDate)
                      : getPaymentStatusLabel(selectedPayment.status)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="flex-1">
                  Print
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
