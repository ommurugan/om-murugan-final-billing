
import BottomNavigation from "@/components/BottomNavigation";
import StandardHeader from "@/components/StandardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GSTInvoiceManagement from "@/components/GSTInvoiceManagement";
import NonGSTInvoiceManagement from "@/components/NonGSTInvoiceManagement";

const Invoices = () => {
  return (
    <StandardHeader title="Invoices">
      <div className="p-4 md:p-6 pb-20 md:pb-6">
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
      
      <BottomNavigation />
    </StandardHeader>
  );
};

export default Invoices;
