
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { useCreateService, useUpdateService, Service } from "@/hooks/useServices";

interface ServiceFormDialogProps {
  editingService?: Service | null;
  onEditingChange?: (service: Service | null) => void;
  isAddForm?: boolean;
}

const ServiceFormDialog = ({ editingService, onEditingChange, isAddForm = false }: ServiceFormDialogProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    base_price: "",
    estimated_time: "",
    category: ""
  });

  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();

  const handleAddService = async () => {
    if (!newService.name || !newService.base_price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await createServiceMutation.mutateAsync({
        name: newService.name,
        description: newService.description || undefined,
        base_price: parseFloat(newService.base_price),
        estimated_time: parseInt(newService.estimated_time) || 60,
        category: newService.category,
        is_active: true
      });
      
      toast.success("Service added successfully!");
      setShowForm(false);
      setNewService({
        name: "",
        description: "",
        base_price: "",
        estimated_time: "",
        category: ""
      });
    } catch (error) {
      toast.error("Failed to add service");
      console.error("Error adding service:", error);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService || !editingService.name || !editingService.base_price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await updateServiceMutation.mutateAsync({
        id: editingService.id,
        name: editingService.name,
        description: editingService.description,
        base_price: editingService.base_price,
        estimated_time: editingService.estimated_time,
        category: editingService.category
      });
      
      toast.success("Service updated successfully!");
      onEditingChange?.(null);
    } catch (error) {
      toast.error("Failed to update service");
      console.error("Error updating service:", error);
    }
  };

  if (isAddForm) {
    return (
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={createServiceMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service offering for your catalog
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input 
                id="serviceName"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                placeholder="Enter service name"
              />
            </div>
            <div>
              <Label htmlFor="serviceDescription">Description</Label>
              <Textarea 
                id="serviceDescription"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                placeholder="Describe the service"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servicePrice">Price (₹) *</Label>
                <Input 
                  id="servicePrice"
                  type="number"
                  value={newService.base_price}
                  onChange={(e) => setNewService({...newService, base_price: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                <Input 
                  id="serviceDuration"
                  type="number"
                  value={newService.estimated_time}
                  onChange={(e) => setNewService({...newService, estimated_time: e.target.value})}
                  placeholder="60"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="serviceCategory">Category</Label>
              <Input 
                id="serviceCategory"
                value={newService.category}
                onChange={(e) => setNewService({...newService, category: e.target.value})}
                placeholder="e.g., Maintenance, Repair"
              />
            </div>
            <Button 
              onClick={handleAddService} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={createServiceMutation.isPending}
            >
              {createServiceMutation.isPending ? "Adding..." : "Add Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={editingService?.id !== undefined} onOpenChange={(open) => !open && onEditingChange?.(null)}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update the service details
          </DialogDescription>
        </DialogHeader>
        {editingService && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="editServiceName">Service Name *</Label>
              <Input 
                id="editServiceName"
                value={editingService.name}
                onChange={(e) => onEditingChange?.({...editingService, name: e.target.value})}
                placeholder="Enter service name"
              />
            </div>
            <div>
              <Label htmlFor="editServiceDescription">Description</Label>
              <Textarea 
                id="editServiceDescription"
                value={editingService.description || ""}
                onChange={(e) => onEditingChange?.({...editingService, description: e.target.value})}
                placeholder="Describe the service"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editServicePrice">Price (₹) *</Label>
                <Input 
                  id="editServicePrice"
                  type="number"
                  value={editingService.base_price}
                  onChange={(e) => onEditingChange?.({...editingService, base_price: parseFloat(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="editServiceDuration">Duration (minutes)</Label>
                <Input 
                  id="editServiceDuration"
                  type="number"
                  value={editingService.estimated_time}
                  onChange={(e) => onEditingChange?.({...editingService, estimated_time: parseInt(e.target.value)})}
                  placeholder="60"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editServiceCategory">Category</Label>
              <Input 
                id="editServiceCategory"
                value={editingService.category}
                onChange={(e) => onEditingChange?.({...editingService, category: e.target.value})}
                placeholder="e.g., Maintenance, Repair"
              />
            </div>
            <Button 
              onClick={handleUpdateService} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={updateServiceMutation.isPending}
            >
              {updateServiceMutation.isPending ? "Updating..." : "Update Service"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;
