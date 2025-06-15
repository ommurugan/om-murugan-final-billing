
import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const MobileToast = ({ message, type, duration = 3000, onClose }: MobileToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white", 
    info: "bg-blue-500 text-white"
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "fixed top-20 left-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 transform",
      colors[type],
      isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
    )}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="p-1 hover:bg-black/10 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MobileToast;
