import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { mockPaymentMethods } from "@/lib/mock-data";
import { CreditCard, DollarSign, Building2, Plus, Edit2, Trash2, Check } from "lucide-react";

export default function PaymentMethods() {
  const [methods, setMethods] = useState(mockPaymentMethods);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "credit_card" as any,
    name: "",
    cardNumber: "",
  });

  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.cardNumber) {
      const newMethod = {
        id: Date.now().toString(),
        type: formData.type,
        name: formData.name,
        lastFourDigits: formData.cardNumber.slice(-4),
        isDefault: methods.length === 0,
      };
      setMethods([...methods, newMethod]);
      setFormData({ type: "credit_card", name: "", cardNumber: "" });
      setShowAddForm(false);
    }
  };

  const setDefault = (methodId: string) => {
    setMethods(
      methods.map((m) => ({
        ...m,
        isDefault: m.id === methodId,
      }))
    );
  };

  const deleteMethod = (methodId: string) => {
    const remaining = methods.filter((m) => m.id !== methodId);
    if (remaining.length === 0) {
      setMethods(remaining);
    } else if (methods.find((m) => m.id === methodId)?.isDefault) {
      remaining[0].isDefault = true;
      setMethods(remaining);
    } else {
      setMethods(remaining);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "credit_card":
        return <CreditCard className="w-6 h-6 text-blue-600" />;
      case "paypal":
        return <DollarSign className="w-6 h-6 text-blue-600" />;
      case "bank_transfer":
        return <Building2 className="w-6 h-6 text-green-600" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
            <p className="text-muted-foreground mt-1">
              Manage your payment methods and payment preferences
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-primary-foreground hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </Button>
        </div>

        {/* Add Payment Method Form */}
        {showAddForm && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Add New Payment Method
            </h3>
            <form onSubmit={handleAddMethod} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <Label className="text-foreground font-medium">Payment Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <Label className="text-foreground font-medium">Cardholder Name</Label>
                  <Input
                    placeholder="e.g., John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Card Number */}
              <div>
                <Label className="text-foreground font-medium">Card / Account Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  maxLength={19}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only last 4 digits will be displayed
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-blue-700"
                >
                  Add Payment Method
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Payment Methods List */}
        <div className="space-y-4">
          {methods.length === 0 ? (
            <Card className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No payment methods
              </h3>
              <p className="text-muted-foreground mb-6">
                Add a payment method to start accepting payments
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-primary text-primary-foreground hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </Card>
          ) : (
            methods.map((method) => (
              <Card
                key={method.id}
                className={`p-6 flex items-center justify-between ${
                  method.isDefault ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600" : ""
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {getTypeIcon(method.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{method.name}</h3>
                      {method.isDefault && (
                        <Badge className="bg-green-100 text-green-700">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getTypeLabel(method.type)}
                      {method.lastFourDigits && ` • •••• •••• •••• ${method.lastFourDigits}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDefault(method.id)}
                      className="border-border hover:bg-secondary"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:bg-secondary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMethod(method.id)}
                    disabled={method.isDefault && methods.length === 1}
                    className="text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Payment Preferences */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Auto-charge overdue payments</p>
                <p className="text-sm text-muted-foreground">
                  Automatically charge overdue rent from default payment method
                </p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-border" />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Payment reminders</p>
                <p className="text-sm text-muted-foreground">
                  Receive email reminders 3 days before payment due date
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Instant payment notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get notified immediately when a payment is received
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
            </div>
          </div>

          <Button className="mt-6 bg-primary text-primary-foreground hover:bg-blue-700">
            Save Preferences
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
