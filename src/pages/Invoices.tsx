
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GSTInvoiceManagement from "@/components/GSTInvoiceManagement";
import NonGSTInvoiceManagement from "@/components/NonGSTInvoiceManagement";

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
            <Tabs defaultValue="non-gst" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="non-gst">Non-GST Invoices</TabsTrigger>
                <TabsTrigger value="gst">GST Invoices</TabsTrigger>
              </TabsList>
              
              <TabsContent value="non-gst">
                <NonGSTInvoiceManagement />
              </TabsContent>
              
              <TabsContent value="gst">
                <GSTInvoiceManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Invoices;
