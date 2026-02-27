import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  type?: "property" | "payment" | "deal" | "client";
}

export default function StatusBadge({ status, type = "property" }: StatusBadgeProps) {
  const getStyleAndLabel = () => {
    // Property status
    if (type === "property") {
      switch (status) {
        case "available":
          return { className: "bg-cyan-100 text-cyan-700", label: "Available" };
        case "rented":
          return { className: "bg-teal-100 text-teal-700", label: "Rented" };
        case "maintenance":
          return { className: "bg-orange-100 text-orange-700", label: "Maintenance" };
        case "sold":
          return { className: "bg-gray-100 text-gray-700", label: "Sold" };
        default:
          return { className: "bg-gray-100 text-gray-700", label: status };
      }
    }

    // Payment status
    if (type === "payment") {
      switch (status) {
        case "paid":
          return { className: "bg-teal-100 text-teal-700", label: "Paid" };
        case "pending":
          return { className: "bg-yellow-100 text-yellow-700", label: "Pending" };
        case "overdue":
          return { className: "bg-red-100 text-red-700", label: "Overdue" };
        case "partial":
          return { className: "bg-cyan-100 text-cyan-700", label: "Partial" };
        default:
          return { className: "bg-gray-100 text-gray-700", label: status };
      }
    }

    // Deal status
    if (type === "deal") {
      switch (status) {
        case "completed":
          return { className: "bg-teal-100 text-teal-700", label: "Completed" };
        case "pending":
          return { className: "bg-yellow-100 text-yellow-700", label: "Pending" };
        case "partial":
          return { className: "bg-cyan-100 text-cyan-700", label: "Partial" };
        default:
          return { className: "bg-gray-100 text-gray-700", label: status };
      }
    }

    // Client status
    if (type === "client") {
      switch (status) {
        case "active":
          return { className: "bg-teal-100 text-teal-700", label: "Active" };
        case "inactive":
          return { className: "bg-gray-100 text-gray-700", label: "Inactive" };
        case "cold":
          return { className: "bg-cyan-100 text-cyan-700", label: "Cold Lead" };
        default:
          return { className: "bg-gray-100 text-gray-700", label: status };
      }
    }

    return { className: "bg-gray-100 text-gray-700", label: status };
  };

  const { className, label } = getStyleAndLabel();

  return <Badge className={className}>{label}</Badge>;
}
