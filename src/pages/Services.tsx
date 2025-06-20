
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StandardLayout from "@/components/StandardLayout";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import ServicesHeader from "@/components/services/ServicesHeader";
import ServicesTab from "@/components/services/ServicesTab";
import PartsTab from "@/components/services/PartsTab";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hooks for services and parts
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useServices();
  const { data: parts = [], isLoading: partsLoading, error: partsError } = useParts();

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (servicesError || partsError) {
    return (
      <StandardLayout title="Services & Parts">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Services & Parts">
      <div className="p-4 md:p-6 pb-20 md:pb-6">
        <ServicesHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="mt-6">
          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services Catalog</TabsTrigger>
              <TabsTrigger value="parts">Parts Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <ServicesTab 
                filteredServices={filteredServices}
                servicesLoading={servicesLoading}
              />
            </TabsContent>

            <TabsContent value="parts">
              <PartsTab 
                filteredParts={filteredParts}
                partsLoading={partsLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StandardLayout>
  );
};

export default Services;
