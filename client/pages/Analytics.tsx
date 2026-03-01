import { useMemo } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockProperties, mockTenants, mockPayments } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
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
import { Download, TrendingUp, Home, Users, DollarSign } from "lucide-react";

export default function Analytics() {
  // Monthly revenue data
  const monthlyRevenueData = [
    { month: "Jan", revenue: 10500, goal: 12000 },
    { month: "Feb", revenue: 12800, goal: 12000 },
    { month: "Mar", revenue: 15300, goal: 12000 },
    { month: "Apr", revenue: 14200, goal: 12000 },
    { month: "May", revenue: 17600, goal: 12000 },
    { month: "Jun", revenue: 19200, goal: 12000 },
    { month: "Jul", revenue: 18900, goal: 12000 },
    { month: "Aug", revenue: 20100, goal: 12000 },
    { month: "Sep", revenue: 19800, goal: 12000 },
    { month: "Oct", revenue: 21500, goal: 12000 },
    { month: "Nov", revenue: 22300, goal: 12000 },
    { month: "Dec", revenue: 23100, goal: 12000 },
  ];

  // Occupancy rate by property type
  const occupancyByType = [
    {
      type: "Apartments",
      occupied: 2,
      available: 0,
      occupancyRate: 100,
      color: "#2563EB",
    },
    {
      type: "Houses",
      occupied: 0,
      available: 2,
      occupancyRate: 0,
      color: "#0EA5E9",
    },
    {
      type: "Commercial",
      occupied: 1,
      available: 1,
      occupancyRate: 50,
      color: "#06B6D4",
    },
    { type: "Land", occupied: 0, available: 1, occupancyRate: 0, color: "#14B8A6" },
  ];

  // Payment statistics
  const paymentStats = useMemo(() => {
    const paid = mockPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
    const pending = mockPayments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
    const overdue = mockPayments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0);

    return [
      { name: "Paid", value: paid, color: "#10B981" },
      { name: "Pending", value: pending, color: "#F59E0B" },
      { name: "Overdue", value: overdue, color: "#EF4444" },
    ];
  }, []);

  // Revenue by property
  const revenueByProperty = mockProperties
    .filter((p) => p.status === "rented")
    .map((p) => ({
      name: p.name.substring(0, 10),
      revenue: p.price,
      occupancy: 100,
    }));

  // Key metrics
  const metrics = useMemo(() => {
    const totalProperties = mockProperties.length;
    const rentedProperties = mockProperties.filter((p) => p.status === "rented").length;
    const occupancyRate = ((rentedProperties / totalProperties) * 100).toFixed(1);
    const totalMonthlyRevenue = mockProperties
      .filter((p) => p.status === "rented")
      .reduce((sum, p) => sum + p.price, 0);
    const avgRentPerProperty = (totalMonthlyRevenue / rentedProperties).toFixed(0);

    return {
      totalProperties,
      rentedProperties,
      occupancyRate,
      totalMonthlyRevenue,
      avgRentPerProperty,
    };
  }, []);

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive financial and operational insights
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm font-medium">Total Properties</p>
            <p className="text-3xl font-bold text-foreground mt-2">{metrics.totalProperties}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm font-medium">Rented Properties</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{metrics.rentedProperties}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm font-medium">Occupancy Rate</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{metrics.occupancyRate}%</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm font-medium">Monthly Revenue</p>
            <p className="text-3xl font-bold text-primary mt-2">
              ${(metrics.totalMonthlyRevenue / 1000).toFixed(1)}K
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm font-medium">Avg Rent/Property</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              ${metrics.avgRentPerProperty}
            </p>
          </Card>
        </div>

        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Annual Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Line type="monotone" dataKey="goal" stroke="#999" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupancy by Property Type */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Occupancy by Property Type
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="occupied" stackId="a" fill="#10B981" name="Occupied" radius={[8, 8, 0, 0]} />
                <Bar dataKey="available" stackId="a" fill="#E5E7EB" name="Available" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Payment Status Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Payment Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: $${(value / 1000).toFixed(1)}K`
                  }
                >
                  {paymentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value / 1000).toFixed(1)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Revenue by Property */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue by Property</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByProperty} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#999" />
              <YAxis dataKey="name" type="category" stroke="#999" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#2563EB" name="Monthly Revenue" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold text-green-600">+18.5%</p>
                <p className="text-xs text-muted-foreground mt-1">vs last month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Property Value</p>
                <p className="text-2xl font-bold text-blue-600">$5,200</p>
                <p className="text-xs text-muted-foreground mt-1">Monthly rent</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Revenue</p>
                <p className="text-2xl font-bold text-amber-600">$11,400</p>
                <p className="text-xs text-muted-foreground mt-1">2 overdue payments</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
