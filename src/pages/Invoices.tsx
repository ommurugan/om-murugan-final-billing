
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import InvoiceManagement from "@/components/InvoiceManagement";

const Invoices = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex w-full">
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Invoices</h1>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            <InvoiceManagement />
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Invoices;
