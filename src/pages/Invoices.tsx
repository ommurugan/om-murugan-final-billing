
import BottomNavigation from "@/components/BottomNavigation";
import StandardHeader from "@/components/StandardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GSTInvoiceManagement from "@/components/GSTInvoiceManagement";
import NonGSTInvoiceManagement from "@/components/NonGSTInvoiceManagement";

const Invoices = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <StandardHeader title="Invoices" />
        
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
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
        </main>
        
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Invoices;
