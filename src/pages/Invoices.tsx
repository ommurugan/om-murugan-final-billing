
import { useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import StandardHeader from "@/components/StandardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GSTInvoiceManagement from "@/components/GSTInvoiceManagement";
import NonGSTInvoiceManagement from "@/components/NonGSTInvoiceManagement";
import { useFilterParams } from "@/hooks/useFilterParams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Invoices = () => {
  const { filterParams, clearFilters } = useFilterParams();

  const hasFilters = Object.values(filterParams).some(value => value !== null);

  return (
    <StandardHeader title="Invoices">
      <div className="w-full">
        <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-full">
          {/* Filter indicators */}
          {hasFilters && (
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filterParams.status && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filterParams.status}
                </Badge>
              )}
              {filterParams.type && (
                <Badge variant="secondary" className="gap-1">
                  Type: {filterParams.type}
                </Badge>
              )}
              {filterParams.date && (
                <Badge variant="secondary" className="gap-1">
                  Date: {filterParams.date}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}

          <Tabs defaultValue="non-gst" className="space-y-4 w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="non-gst">Non-GST Invoices</TabsTrigger>
              <TabsTrigger value="gst">GST Invoices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="non-gst" className="w-full">
              <NonGSTInvoiceManagement />
            </TabsContent>
            
            <TabsContent value="gst" className="w-full">
              <GSTInvoiceManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNavigation />
    </StandardHeader>
  );
};

export default Invoices;
