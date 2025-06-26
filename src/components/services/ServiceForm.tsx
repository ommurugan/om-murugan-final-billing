
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Service } from "@/hooks/useServices";
import ServiceFormFields from "./ServiceFormFields";
import DurationSelector from "./DurationSelector";
import ServiceFormActions from "./ServiceFormActions";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceData: any) => void;
  isLoading: boolean;
  editingService?: Service | null;
  title: string;
  description: string;
}

const ServiceForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  editingService, 
  title, 
  description 
}: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    labor_charges: "",
    estimated_time: "",
    category: "",
    hsn_code: ""
  });

  const [durationFormat, setDurationFormat] = useState("minutes");

  // Reset form when editing service changes or dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (editingService) {
        setFormData({
          name: editingService.name || "",
          description: editingService.description || "",
          base_price: editingService.base_price?.toString() || "",
          labor_charges: editingService.labor_charges?.toString() || "",
          estimated_time: editingService.estimated_time?.toString() || "",
          category: editingService.category || "",
          hsn_code: editingService.hsn_code || ""
        });
      } else {
        // Reset to empty form for new service
        setFormData({
          name: "",
          description: "",
          base_price: "",
          labor_charges: "",
          estimated_time: "",
          category: "",
          hsn_code: ""
        });
      }
    }
  }, [isOpen, editingService]);

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
    // Validate required fields
    if (!formData.name.trim()) {
      console.log("Service name is required");
      return;
    }
    
    if (!formData.category.trim()) {
      console.log("Category is required");
      return;
    }
    
    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      console.log("Valid base price is required");
      return;
    }

    const serviceData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      base_price: parseFloat(formData.base_price),
      labor_charges: parseFloat(formData.labor_charges) || 0,
      estimated_time: convertToMinutes(formData.estimated_time, durationFormat) || 60,
      category: formData.category.trim(),
      hsn_code: formData.hsn_code.trim(),
      is_active: true
    };

    if (editingService) {
      onSubmit({
        id: editingService.id,
        ...serviceData
      });
    } else {
      onSubmit(serviceData);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleDurationFormatChange = (newFormat: string) => {
    const currentMinutes = convertToMinutes(formData.estimated_time, durationFormat);
    const newValue = convertFromMinutes(currentMinutes, newFormat);
    setDurationFormat(newFormat);
    setFormData({...formData, estimated_time: newValue});
  };

  const isFormValid = formData.name.trim() && formData.category.trim() && formData.base_price && parseFloat(formData.base_price) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 mx-4">
        <div className="flex-shrink-0 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="text-base">{description}</DialogDescription>
          </DialogHeader>
        </div>
        
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6">
            <ServiceFormFields 
              formData={formData}
              onFormDataChange={setFormData}
            />
            
            <DurationSelector
              estimatedTime={formData.estimated_time}
              durationFormat={durationFormat}
              onDurationChange={(value) => setFormData({...formData, estimated_time: value})}
              onFormatChange={handleDurationFormatChange}
            />
          </div>
        </ScrollArea>
        
        <ServiceFormActions
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEditMode={!!editingService}
          isFormValid={isFormValid}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
