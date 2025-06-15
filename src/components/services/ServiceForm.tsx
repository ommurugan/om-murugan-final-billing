
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "@/hooks/useServices";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceData: any) => void;
  isLoading: boolean;
  editingService?: Service | null;
  title: string;
  description: string;
}

const ServiceForm = ({ isOpen, onClose, onSubmit, isLoading, editingService, title, description }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: editingService?.name || "",
    description: editingService?.description || "",
    base_price: editingService?.base_price?.toString() || "",
    estimated_time: editingService?.estimated_time?.toString() || "",
    category: editingService?.category || ""
  });

  const handleSubmit = () => {
    if (editingService) {
      onSubmit({
        id: editingService.id,
        name: formData.name,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        estimated_time: parseInt(formData.estimated_time),
        category: formData.category
      });
    } else {
      onSubmit({
        name: formData.name,
        description: formData.description || undefined,
        base_price: parseFloat(formData.base_price),
        estimated_time: parseInt(formData.estimated_time) || 60,
        category: formData.category,
        is_active: true
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      base_price: "",
      estimated_time: "",
      category: ""
    });
  };

  const handleClose = () => {
    onClose();
    if (!editingService) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="serviceName">Service Name *</Label>
            <Input 
              id="serviceName"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter service name"
            />
          </div>
          <div>
            <Label htmlFor="serviceDescription">Description</Label>
            <Textarea 
              id="serviceDescription"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                value={formData.base_price}
                onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="serviceDuration">Duration (minutes)</Label>
              <Input 
                id="serviceDuration"
                type="number"
                value={formData.estimated_time}
                onChange={(e) => setFormData({...formData, estimated_time: e.target.value})}
                placeholder="60"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="serviceCategory">Category</Label>
            <Input 
              id="serviceCategory"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="e.g., Maintenance, Repair"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (editingService ? "Updating..." : "Adding...") : (editingService ? "Update Service" : "Add Service")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
