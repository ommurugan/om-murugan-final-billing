
import { useState, useEffect } from "react";
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileOfflineIndicator = () => {
  const { isOnline } = useMobileFeatures();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
    } else {
      // Hide offline message with a delay when coming back online
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showOfflineMessage) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 flex justify-center">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300",
          isOnline ? "bg-green-500" : "bg-red-500"
        )}
      >
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>Back Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>No Internet Connection</span>
          </>
        )}
      </Badge>
    </div>
  );
};

export default MobileOfflineIndicator;
