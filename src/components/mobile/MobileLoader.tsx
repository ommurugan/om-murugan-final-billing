
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const MobileLoader = ({ size = "md", className, text }: MobileLoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default MobileLoader;
