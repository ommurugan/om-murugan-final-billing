
import { ReactNode } from "react";
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import BottomNavigation from "@/components/BottomNavigation";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBottomNav?: boolean;
  className?: string;
}

const MobileLayout = ({ 
  children, 
  title, 
  showBottomNav = true, 
  className 
}: MobileLayoutProps) => {
  const { isNative } = useMobileFeatures();

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 flex flex-col",
      isNative ? "pt-safe-top pb-safe-bottom" : "",
      className
    )}>
      {/* Status Bar Spacer for Native Apps */}
      {isNative && <div className="h-12 bg-white" />}
      
      {/* Header */}
      {title && (
        <header className="bg-white shadow-sm border-b px-4 py-4 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </header>
      )}
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto",
        showBottomNav ? "pb-20" : "pb-4"
      )}>
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default MobileLayout;
