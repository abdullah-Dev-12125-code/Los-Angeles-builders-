import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockDeals, mockClients, mockProperties } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";
import { Plus, Eye, DollarSign, TrendingUp } from "lucide-react";

export default function Deals() {
  const [deals, setDeals] = useState(mockDeals);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  const getClientName = (clientId: string) => {
    return mockClients.find((c) => c.id === clientId)?.name || "Unknown";
  };

  const getPropertyName = (propertyId: string) => {
    return mockProperties.find((p) => p.id === propertyId)?.name || "Unknown";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = useMemo(() => {
    const completed = deals.filter((d) => d.status === "completed");
    const totalRevenue = deals.reduce((sum, d) => sum + d.dealPrice, 0);
    const totalCommission = deals.reduce((sum, d) => sum + (d.commission || 0), 0);

    return {
      totalDeals: deals.length,
      completedDeals: completed.length,
      totalRevenue,
      totalCommission,
    };
  }, [deals]);

  const updateDealStatus = (dealId: string, newStatus: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      setDeals(
        deals.map((d) =>
          d.id === dealId
            ? { ...d, status: newStatus as any }
            : d
        )
      );
      setToast({
        type: "success",
        title: "Deal Updated",
        message: `Deal status has been updated to ${newStatus}`,
      });
    }
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Deals & Transactions</h1>
            <p className="text-muted-foreground mt-1">
              Track all property deals and commission payments
            </p>
          </div>
          <Button className="gap-2 shadow-lg animate-slideUp">
            <Plus className="w-5 h-5" />
            New Deal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 animate-slideUp hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Deals</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalDeals}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 animate-slideUp hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-teal-600">{stats.completedDeals}</p>
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
          <Card className="p-6 animate-slideUp hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission Earned</p>
                <p className="text-3xl font-bold text-teal-600">
                  ${(stats.totalCommission / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Deals Table */}
        <Card className="overflow-hidden animate-slideUp">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary border-b border-border">
                  <TableHead className="text-foreground font-semibold">Client</TableHead>
                  <TableHead className="text-foreground font-semibold">Property</TableHead>
                  <TableHead className="text-foreground font-semibold">Deal Price</TableHead>
                  <TableHead className="text-foreground font-semibold">Commission</TableHead>
                  <TableHead className="text-foreground font-semibold">Deal Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold">Payment Status</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow
                    key={deal.id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <TableCell className="font-semibold text-foreground">
                      {getClientName(deal.clientId)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {getPropertyName(deal.propertyId)}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      ${deal.dealPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-foreground">
                      ${deal.commission?.toLocaleString()}
                      <span className="text-muted-foreground text-sm ml-1">
                        ({deal.commissionRate}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDate(deal.dealDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={deal.status} type="deal" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={deal.paymentStatus} type="payment" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedDeal(deal)}
                        className="text-primary hover:bg-secondary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Deal Details Modal */}
        {selectedDeal && (
          <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 animate-slideUp">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Deal Details</h2>
              <button
                onClick={() => setSelectedDeal(null)}
                className="text-foreground/50 hover:text-foreground/80 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Deal ID</p>
                  <p className="text-lg font-semibold text-foreground">{selectedDeal.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Client</p>
                  <p className="text-lg font-semibold text-foreground">
                    {getClientName(selectedDeal.clientId)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Property</p>
                  <p className="text-lg font-semibold text-foreground">
                    {getPropertyName(selectedDeal.propertyId)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Deal Date</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatDate(selectedDeal.dealDate)}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-muted-foreground font-medium">Deal Price</p>
                  <p className="text-3xl font-bold text-primary">
                    ${selectedDeal.dealPrice.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-muted-foreground font-medium">Commission Earned</p>
                  <p className="text-3xl font-bold text-cyan-600">
                    ${selectedDeal.commission?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-semibold text-foreground mb-3">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {["pending", "partial", "completed"].map((status) => (
                  <Button
                    key={status}
                    onClick={() => updateDealStatus(selectedDeal.id, status)}
                    variant={selectedDeal.status === status ? "default" : "outline"}
                    className={
                      selectedDeal.status === status
                        ? "bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:bg-secondary"
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {selectedDeal.notes && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-foreground mb-2">Notes</p>
                <p className="text-foreground bg-white p-3 rounded-lg">{selectedDeal.notes}</p>
              </div>
            )}

            <Button
              onClick={() => setSelectedDeal(null)}
              className="mt-6 w-full shadow-lg"
            >
              Close
            </Button>
          </Card>
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </Layout>
  );
}
