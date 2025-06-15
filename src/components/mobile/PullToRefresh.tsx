
import { useState, useRef, useEffect, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  pullDistance?: number;
  refreshThreshold?: number;
}

const PullToRefresh = ({ 
  onRefresh, 
  children, 
  pullDistance = 80,
  refreshThreshold = 60 
}: PullToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      e.preventDefault();
      setIsPulling(true);
      setPullY(Math.min(diff * 0.5, pullDistance));
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling || isRefreshing) return;

    if (pullY >= refreshThreshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setIsPulling(false);
    setPullY(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullY, isRefreshing]);

  return (
    <div ref={containerRef} className="relative h-full overflow-auto">
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 bg-blue-50 border-b border-blue-100",
          isPulling || isRefreshing ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          height: `${Math.max(pullY, isRefreshing ? 60 : 0)}px`,
          transform: `translateY(-${Math.max(pullY, isRefreshing ? 60 : 0) - (isPulling ? pullY : isRefreshing ? 60 : 0)}px)`
        }}
      >
        <RefreshCw 
          className={cn(
            "h-5 w-5 text-blue-600 transition-transform duration-200",
            (isRefreshing || pullY >= refreshThreshold) && "animate-spin"
          )} 
        />
        <span className="ml-2 text-sm text-blue-600 font-medium">
          {isRefreshing ? "Refreshing..." : pullY >= refreshThreshold ? "Release to refresh" : "Pull to refresh"}
        </span>
      </div>
      
      <div style={{ transform: `translateY(${isPulling ? pullY : 0}px)` }}>
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
