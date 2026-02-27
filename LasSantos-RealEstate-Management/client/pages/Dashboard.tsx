import { useMemo } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import {
  mockProperties,
  mockPayments,
  mockClients,
  mockDeals,
} from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Home,
  DollarSign,
  Users,
  Handshake,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const stats = useMemo(() => {
    const totalProperties = mockProperties.length;
    const rentedProperties = mockProperties.filter(
      (p) => p.status === "rented",
    ).length;
    const availableProperties = mockProperties.filter(
      (p) => p.status === "available",
    ).length;
    const maintenanceProperties = mockProperties.filter(
      (p) => p.status === "maintenance",
    ).length;
    const totalRevenue = mockProperties
      .filter((p) => p.status === "rented")
      .reduce((sum, p) => sum + p.price, 0);
    const occupancyRate = ((rentedProperties / totalProperties) * 100).toFixed(
      1,
    );

    // Client stats
    const totalClients = mockClients.length;
    const activeClients = mockClients.filter(
      (c) => c.status === "active",
    ).length;
    const totalClientRevenue = mockClients.reduce(
      (sum, c) => sum + c.totalSpent,
      0,
    );

    // Deal stats
    const totalDeals = mockDeals.length;
    const completedDeals = mockDeals.filter(
      (d) => d.status === "completed",
    ).length;
    const totalDealValue = mockDeals.reduce((sum, d) => sum + d.dealPrice, 0);
    const totalCommission = mockDeals.reduce(
      (sum, d) => sum + (d.commission || 0),
      0,
    );

    // Payment stats
    const overduePayments = mockPayments.filter((p) => p.status === "overdue");

    return {
      totalProperties,
      rentedProperties,
      availableProperties,
      maintenanceProperties,
      totalRevenue,
      occupancyRate,
      totalClients,
      activeClients,
      totalClientRevenue,
      totalDeals,
      completedDeals,
      totalDealValue,
      totalCommission,
      overduePayments: overduePayments.length,
      overdueAmount: overduePayments.reduce((sum, p) => sum + p.amount, 0),
    };
  }, []);

  // Revenue trend data
  const revenueData = [
    { month: "Jan", rental: 10500, sales: 45000 },
    { month: "Feb", rental: 12800, sales: 50000 },
    { month: "Mar", rental: 15300, sales: 55000 },
    { month: "Apr", rental: 14200, sales: 48000 },
    { month: "May", rental: 17600, sales: 62000 },
    { month: "Jun", rental: 19500, sales: 70000 },
  ];

  // Property type distribution
  const propertyTypeData = [
    { name: "Apartments", value: 2, color: "#0d9488" },
    { name: "Houses", value: 2, color: "#14b8a6" },
    { name: "Commercial", value: 2, color: "#2dd4bf" },
    { name: "Land", value: 1, color: "#5eead4" },
  ];

  // Payment status
  const paymentStats = {
    paid: mockPayments.filter((p) => p.status === "paid").length,
    pending: mockPayments.filter((p) => p.status === "pending").length,
    overdue: mockPayments.filter((p) => p.status === "overdue").length,
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your property management overview.
          </p>
        </div>

        {/* Property Stats Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 animate-stagger-1 hover:shadow-lg hover:lift transition-all bg-gradient-to-br from-teal-50 to-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Properties
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stats.totalProperties}
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-stagger-2 hover:shadow-lg hover:lift transition-all bg-gradient-to-br from-teal-50 to-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Rented
                  </p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">
                    {stats.rentedProperties}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.occupancyRate}% occupancy
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-stagger-3 hover:shadow-lg hover:lift transition-all bg-gradient-to-br from-cyan-50 to-cyan-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Available
                  </p>
                  <p className="text-3xl font-bold text-cyan-600 mt-2">
                    {stats.availableProperties}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ready to rent
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-200 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-stagger-4 hover:shadow-lg hover:lift transition-all bg-gradient-to-br from-teal-50 to-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Monthly Revenue
                  </p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">
                    ${(stats.totalRevenue / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Client & Deal Stats Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Business Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 animate-stagger-5 hover:shadow-lg hover:lift transition-all bg-gradient-to-br from-teal-50 to-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Clients
                  </p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">
                    {stats.totalClients}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.activeClients} active
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-stagger-6 hover:shadow-lg hover:lift transition-all bg-gradient-to-br from-cyan-50 to-cyan-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Deals
                  </p>
                  <p className="text-3xl font-bold text-cyan-600 mt-2">
                    {stats.totalDeals}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.completedDeals} completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-200 rounded-lg flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-stagger-7 hover:shadow-lg hover:lift transition-all bg-gradient-to-br from-teal-50 to-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Deal Value
                  </p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">
                    ${(stats.totalDealValue / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-stagger-8 hover:shadow-lg hover:lift transition-all bg-gradient-to-br from-cyan-50 to-cyan-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Commission Earned
                  </p>
                  <p className="text-3xl font-bold text-cyan-600 mt-2">
                    ${(stats.totalCommission / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-200 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Alert: Overdue Payments */}
        {stats.overduePayments > 0 && (
          <Card className="p-4 bg-red-50 border-l-4 border-red-500 animate-slideUp hover:shadow-lg hover:lift transition-all">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 animate-wiggle" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Overdue Payments</h3>
                <p className="text-sm text-red-700 mt-1">
                  {stats.overduePayments} payment(s) totaling $
                  {stats.overdueAmount.toLocaleString()} are overdue
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend Chart */}
          <Card className="lg:col-span-2 p-6 animate-stagger-6 hover:shadow-lg hover:lift transition-all">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rental"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={{ fill: "#0d9488", r: 4 }}
                  name="Rental Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4", r: 4 }}
                  name="Sales Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Property Type Distribution */}
          <Card className="p-6 animate-stagger-7 hover:shadow-lg hover:lift transition-all">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Property Types
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {propertyTypeData.map((type) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm text-foreground">{type.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {type.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Payment Status Overview */}
        <Card className="p-6 animate-stagger-8 hover:shadow-lg hover:lift transition-all">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Payment Status Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  status: "Payment Status",
                  Paid: paymentStats.paid,
                  Pending: paymentStats.pending,
                  Overdue: paymentStats.overdue,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="status" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="Paid" fill="#10B981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Pending" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Overdue" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Layout>
  );
}
