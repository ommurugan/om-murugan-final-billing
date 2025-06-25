
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    labor_charges: editingService?.labor_charges?.toString() || "",
    estimated_time: editingService?.estimated_time?.toString() || "",
    category: editingService?.category || "",
    hsn_code: editingService?.hsn_code || ""
  });

  const [durationFormat, setDurationFormat] = useState("minutes");

  const convertToMinutes = (value: string, format: string): number => {
    const numValue = parseInt(value) || 0;
    switch (format) {
      case "days":
        return numValue * 1440; // 24 * 60
      case "months":
        return numValue * 43200; // 30 * 24 * 60
      case "minutes":
      default:
        return numValue;
    }
  };

  const convertFromMinutes = (minutes: number, format: string): string => {
    switch (format) {
      case "days":
        return Math.floor(minutes / 1440).toString();
      case "months":
        return Math.floor(minutes / 43200).toString();
      case "minutes":
      default:
        return minutes.toString();
    }
  };

  const handleSubmit = () => {
    if (editingService) {
      onSubmit({
        id: editingService.id,
        name: formData.name,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        labor_charges: parseFloat(formData.labor_charges) || 0,
        estimated_time: convertToMinutes(formData.estimated_time, durationFormat),
        category: formData.category,
        hsn_code: formData.hsn_code
      });
    } else {
      onSubmit({
        name: formData.name,
        description: formData.description || undefined,
        base_price: parseFloat(formData.base_price),
        labor_charges: parseFloat(formData.labor_charges) || 0,
        estimated_time: convertToMinutes(formData.estimated_time, durationFormat) || 60,
        category: formData.category,
        hsn_code: formData.hsn_code,
        is_active: true
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      base_price: "",
      labor_charges: "",
      estimated_time: "",
      category: "",
      hsn_code: ""
    });
    setDurationFormat("minutes");
  };

  const handleClose = () => {
    onClose();
    if (!editingService) {
      resetForm();
    }
  };

  const handleDurationFormatChange = (newFormat: string) => {
    const currentMinutes = convertToMinutes(formData.estimated_time, durationFormat);
    const newValue = convertFromMinutes(currentMinutes, newFormat);
    setDurationFormat(newFormat);
    setFormData({...formData, estimated_time: newValue});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md h-[90vh] flex flex-col p-0">
        <div className="flex-shrink-0 p-6 border-b">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </div>
        
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
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
                <Label htmlFor="laborCharges">Labor Charges (₹)</Label>
                <Input 
                  id="laborCharges"
                  type="number"
                  value={formData.labor_charges}
                  onChange={(e) => setFormData({...formData, labor_charges: e.target.value})}
                  placeholder="0"
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
            <div>
              <Label htmlFor="hsnCode">HSN Code</Label>
              <Input 
                id="hsnCode"
                value={formData.hsn_code}
                onChange={(e) => setFormData({...formData, hsn_code: e.target.value})}
                placeholder="e.g., 998314"
              />
            </div>
            <div>
              <Label htmlFor="durationFormat">Duration Format</Label>
              <Select value={durationFormat} onValueChange={handleDurationFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="serviceDuration">
                Duration ({durationFormat === "minutes" ? "minutes" : durationFormat === "days" ? "days" : "months"})
              </Label>
              <Input 
                id="serviceDuration"
                type="number"
                value={formData.estimated_time}
                onChange={(e) => setFormData({...formData, estimated_time: e.target.value})}
                placeholder={durationFormat === "minutes" ? "60" : durationFormat === "days" ? "1" : "1"}
              />
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex-shrink-0 p-6 border-t">
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
