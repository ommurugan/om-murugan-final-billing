
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useServices, useDeleteService, Service } from "@/hooks/useServices";
import ServiceFormDialog from "./ServiceFormDialog";

interface ServicesTabProps {
  searchTerm: string;
}

const ServicesTab = ({ searchTerm }: ServicesTabProps) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const deleteServiceMutation = useDeleteService();

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteService = async (id: string) => {
    try {
      await deleteServiceMutation.mutateAsync(id);
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete service");
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Services Catalog</h2>
          <p className="text-gray-600">Manage your service offerings and pricing</p>
        </div>
        <ServiceFormDialog isAddForm={true} />
      </div>

      {servicesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wrench className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <ServiceFormDialog
                      editingService={editingService}
                      onEditingChange={(service) => setEditingService(service)}
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={deleteServiceMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {service.description && (
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-green-600">₹{service.base_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{service.estimated_time} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesTab;
