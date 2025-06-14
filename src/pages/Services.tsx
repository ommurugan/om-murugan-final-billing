import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import StandardHeader from "@/components/StandardHeader";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import ServicesTab from "@/components/services/ServicesTab";
import PartsTab from "@/components/services/PartsTab";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Keep hooks for error handling
  const { error: servicesError } = useServices();
  const { error: partsError } = useParts();

  if (servicesError || partsError) {
    return (
      <StandardHeader title="Services & Parts">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </StandardHeader>
    );
  }

  return (
    <StandardHeader title="Services & Parts">
      <div className="p-6">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search services and parts..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Services Catalog</TabsTrigger>
            <TabsTrigger value="parts">Parts Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesTab searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="parts">
            <PartsTab searchTerm={searchTerm} />
          </TabsContent>
        </Tabs>
      </div>
    </StandardHeader>
  );
};

export default Services;
