
import { ReactNode } from "react";
import MobileSidebar from "./MobileSidebar";
import Sidebar from "./Sidebar";
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
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Desktop Main Content Area */}
        <div className="flex-1 flex flex-col w-full">
          <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 flex-shrink-0 safe-area-inset-top">
            <div className="flex justify-between items-center min-h-[44px]">
              <div className="flex-1">
                {/* Title removed */}
              </div>
              <div className="flex-shrink-0 ml-4">
                {children}
              </div>
            </div>
          </header>
          
          <main className="flex-1 w-full overflow-x-hidden">
            {/* Content will be passed as children to the page component */}
          </main>
        </div>
      </div>

      {/* Mobile Layout - Full Width */}
      <div className="md:hidden w-full min-h-screen">
        {/* Mobile Sidebar */}
        <MobileSidebar />
        
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b px-4 py-4 pt-16 flex-shrink-0 safe-area-inset-top">
          <div className="flex justify-between items-center min-h-[44px]">
            <div className="flex-1">
              {/* Title removed */}
            </div>
            <div className="flex-shrink-0 ml-4">
              {children}
            </div>
          </div>
        </header>
        
        {/* Mobile Main Content */}
        <main className="w-full overflow-x-hidden pb-20">
          {/* Content will be passed as children to the page component */}
        </main>
        
        {/* Bottom Navigation for Mobile */}
        <BottomNavigation />
      </div>
    </div>
  );
};

export default StandardHeader;
