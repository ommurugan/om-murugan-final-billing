
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ServiceFormProps {
  onSave: (service: any) => void;
  onCancel: () => void;
  existingService?: any;
}

const ServiceForm = ({ onSave, onCancel, existingService }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: existingService?.name || "",
    category: existingService?.category || "",
    basePrice: existingService?.basePrice || 0,
    laborCharges: existingService?.laborCharges || 0,
    estimatedTime: existingService?.estimatedTime || 0,
    description: existingService?.description || "",
    isActive: existingService?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || formData.basePrice <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const service = {
      id: existingService?.id || Date.now().toString(),
      ...formData,
      createdAt: existingService?.createdAt || new Date().toISOString()
    };

    onSave(service);
    toast.success(existingService ? "Service updated successfully!" : "Service created successfully!");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{existingService ? "Edit Service" : "Add New Service"}</CardTitle>
        <CardDescription>
          {existingService ? "Update service details" : "Enter the details for the new service"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Oil Change"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="bodywork">Body Work</SelectItem>
                  <SelectItem value="engine">Engine</SelectItem>
                  <SelectItem value="transmission">Transmission</SelectItem>
                  <SelectItem value="brake">Brake System</SelectItem>
                  <SelectItem value="suspension">Suspension</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (₹) *</Label>
              <Input
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="laborCharges">Labor Charges (₹)</Label>
              <Input
                id="laborCharges"
                type="number"
                value={formData.laborCharges}
                onChange={(e) => setFormData({ ...formData, laborCharges: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
              <Input
                id="estimatedTime"
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 0 })}
                placeholder="60"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.isActive ? "active" : "inactive"} 
                onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the service..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {existingService ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceForm;
