import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
}

export default function Toast({
  type,
  title,
  message,
  onClose,
  autoClose = true,
}: ToastProps) {
  // Auto close after 5 seconds
  if (autoClose) {
    setTimeout(onClose, 5000);
  }

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-l-4 border-green-500",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        };
      case "error":
        return {
          bg: "bg-red-50 border-l-4 border-red-500",
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        };
      case "info":
        return {
          bg: "bg-blue-50 border-l-4 border-blue-500",
          icon: <Info className="w-5 h-5 text-blue-600" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg ${styles.bg} animate-slideDown z-50`}>
      <div className="flex items-start gap-3">
        {styles.icon}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {message && <p className="text-sm text-foreground/80 mt-1">{message}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-foreground/50 hover:text-foreground/80"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
