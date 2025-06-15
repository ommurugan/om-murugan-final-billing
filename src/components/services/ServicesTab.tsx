
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useServices, useCreateService, useUpdateService, useDeleteService, Service } from "@/hooks/useServices";
import ServiceCard from "./ServiceCard";
import ServiceForm from "./ServiceForm";

interface ServicesTabProps {
  filteredServices: Service[];
  servicesLoading: boolean;
}

const ServicesTab = ({ filteredServices, servicesLoading }: ServicesTabProps) => {
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const handleAddService = async (serviceData: any) => {
    if (!serviceData.name || !serviceData.base_price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await createServiceMutation.mutateAsync(serviceData);
      toast.success("Service added successfully!");
      setShowAddServiceForm(false);
    } catch (error) {
      toast.error("Failed to add service");
      console.error("Error adding service:", error);
    }
  };

  const handleUpdateService = async (serviceData: any) => {
    if (!serviceData.name || !serviceData.base_price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await updateServiceMutation.mutateAsync(serviceData);
      toast.success("Service updated successfully!");
      setEditingService(null);
    } catch (error) {
      toast.error("Failed to update service");
      console.error("Error updating service:", error);
    }
  };

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
        <Button 
          className="bg-blue-600 hover:bg-blue-700" 
          disabled={createServiceMutation.isPending}
          onClick={() => setShowAddServiceForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {servicesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={setEditingService}
              onDelete={handleDeleteService}
              isDeleting={deleteServiceMutation.isPending}
            />
          ))}
        </div>
      )}

      <ServiceForm
        isOpen={showAddServiceForm}
        onClose={() => setShowAddServiceForm(false)}
        onSubmit={handleAddService}
        isLoading={createServiceMutation.isPending}
        title="Add New Service"
        description="Create a new service offering for your catalog"
      />

      <ServiceForm
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        onSubmit={handleUpdateService}
        isLoading={updateServiceMutation.isPending}
        editingService={editingService}
        title="Edit Service"
        description="Update the service details"
      />
    </div>
  );
};

export default ServicesTab;
