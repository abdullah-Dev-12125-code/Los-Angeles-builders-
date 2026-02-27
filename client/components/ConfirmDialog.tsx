import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-full max-w-md mx-4 animate-slideUp shadow-2xl">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDangerous ? "bg-red-100" : "bg-blue-100"}`}>
              <AlertCircle
                className={`w-6 h-6 ${isDangerous ? "text-red-600" : "text-blue-600"}`}
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-foreground text-center mb-2">
            {title}
          </h2>

          {/* Message */}
          <p className="text-foreground/80 text-center mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary disabled:opacity-50"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 text-white transition-all ${
                isDangerous
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                  : "bg-primary hover:bg-blue-700 disabled:bg-blue-400"
              }`}
            >
              {isLoading ? "Processing..." : confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
