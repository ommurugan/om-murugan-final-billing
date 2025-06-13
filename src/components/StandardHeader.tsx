import { ReactNode } from "react";
import MobileSidebar from "./MobileSidebar";
interface StandardHeaderProps {
  title: string;
  children?: ReactNode;
}
const StandardHeader = ({
  title,
  children
}: StandardHeaderProps) => {
  return <div className="flex w-full min-h-screen bg-gray-50">
      <MobileSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            
            {children}
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {/* Content will be passed as children to the page component */}
        </main>
      </div>
    </div>;
};
export default StandardHeader;