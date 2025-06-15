import { ReactNode } from "react";
import MobileSidebar from "./MobileSidebar";
import BottomNavigation from "./BottomNavigation";

interface StandardHeaderProps {
  title: string;
  children?: ReactNode;
}

const StandardHeader = ({
  title,
  children
}: StandardHeaderProps) => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Full Width Layout - No Desktop Sidebar */}
      <div className="w-full min-h-screen">
        {/* Hamburger Menu */}
        <MobileSidebar />
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 flex-shrink-0 safe-area-inset-top">
          <div className="flex justify-between items-center min-h-[44px]">
            <div className="flex-1">
              {/* Space for any future content */}
            </div>
            <div className="flex-shrink-0 ml-4">
              {children}
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="w-full overflow-x-hidden pb-20 md:pb-6">
          {/* Content will be passed as children to the page component */}
        </main>
        
        {/* Bottom Navigation for Mobile */}
        <div className="md:hidden">
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default StandardHeader;
