
import { ReactNode } from "react";
import MobileSidebar from "./MobileSidebar";

interface StandardHeaderProps {
  title: string;
  children?: ReactNode;
}

const StandardHeader = ({ title, children }: StandardHeaderProps) => {
  return (
    <div className="flex w-full">
      <MobileSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
            {children}
          </div>
        </header>
      </div>
    </div>
  );
};

export default StandardHeader;
