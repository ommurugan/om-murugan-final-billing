
import { ReactNode } from "react";
import MobileSidebar from "./MobileSidebar";
import Sidebar from "./Sidebar";

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
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {children}
          </div>
        </header>
        
        <main className="flex-1 w-full">
          {/* Content will be passed as children to the page component */}
        </main>
      </div>
    </div>
  );
};

export default StandardHeader;
