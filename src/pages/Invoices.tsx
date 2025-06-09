
import Sidebar from "@/components/Sidebar";
import InvoiceManagement from "@/components/InvoiceManagement";

const Invoices = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          </div>
        </header>

        <div className="p-6">
          <InvoiceManagement />
        </div>
      </div>
    </div>
  );
};

export default Invoices;
