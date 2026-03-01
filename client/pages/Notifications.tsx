import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/lib/mock-data";
import { AlertCircle, Clock, Home, Gift, CheckCircle, Trash2, MarkAllAsRead } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (filter === "important") {
      filtered = filtered.filter((n) =>
        ["payment_overdue", "lease_expiring"].includes(n.type)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, filter]);

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "payment_due":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "lease_expiring":
        return <Home className="w-5 h-5 text-yellow-600" />;
      case "new_tenant":
        return <Gift className="w-5 h-5 text-green-600" />;
      case "maintenance":
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "payment_overdue":
        return "bg-red-50 border-l-4 border-red-600";
      case "payment_due":
        return "bg-orange-50 border-l-4 border-orange-600";
      case "lease_expiring":
        return "bg-yellow-50 border-l-4 border-yellow-600";
      case "new_tenant":
        return "bg-green-50 border-l-4 border-green-600";
      case "maintenance":
        return "bg-blue-50 border-l-4 border-blue-600";
      default:
        return "bg-gray-50 border-l-4 border-gray-600";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const importantCount = notifications.filter((n) =>
    ["payment_overdue", "lease_expiring"].includes(n.type)
  ).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with important reminders and alerts
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Notifications</p>
                <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-amber-600">{unreadCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Important</p>
                <p className="text-2xl font-bold text-yellow-600">{importantCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["all", "unread", "important"].map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f as any)}
              variant={filter === f ? "default" : "outline"}
              className={
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:bg-secondary"
              }
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                {filter === "unread" && "No unread notifications"}
                {filter === "important" && "No important notifications"}
                {filter === "all" && "No notifications"}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 flex items-start gap-4 transition-all ${getNotificationColor(notification.type)} ${
                  !notification.isRead ? "shadow-md" : ""
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-foreground/80 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5" />
                    )}
                  </div>

                  <p className="text-xs text-foreground/60 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      className="text-primary hover:bg-white/50"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:bg-red-100/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Notification Settings Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Notification Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-foreground">Email notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-foreground">Push notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-foreground">SMS alerts</p>
                <p className="text-sm text-muted-foreground">
                  Receive urgent alerts via SMS
                </p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-border" />
            </div>
          </div>
          <Button className="mt-6 bg-primary text-primary-foreground hover:bg-blue-700">
            Save Settings
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
