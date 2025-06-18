
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Customer } from "@/types/billing";
import { useCustomerForm } from "@/hooks/useCustomerForm";
import { useCustomerSubmission } from "@/hooks/useCustomerSubmission";
import CustomerFormSection from "@/components/customer/CustomerFormSection";
import CustomerVehicleFormSection from "@/components/customer/CustomerVehicleFormSection";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface CustomerQuickAddProps {
  onCustomerAdded: (customer: Customer) => void;
}

const CustomerQuickAdd = ({ onCustomerAdded }: CustomerQuickAddProps) => {
  const [open, setOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState<'car' | 'bike' | 'scooter' | 'van' | 'truck'>('car');
  const { formData, updateFormData, resetForm, validateForm } = useCustomerForm();
  const { submitForm, isLoading } = useCustomerSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    await submitForm(
      formData,
      onCustomerAdded,
      () => {
        setOpen(false);
        resetForm();
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer & Vehicle</DialogTitle>
          <DialogDescription>
            Add a new customer and their vehicle details
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Customer Details */}
          <div className="space-y-4">
            <h4 className="font-medium">Customer Information</h4>
            <CustomerFormSection 
              formData={formData}
              onUpdateField={updateFormData}
            />
          </div>

          <Separator />

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h4 className="font-medium">Vehicle Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle-type">Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={(value: 'car' | 'bike' | 'scooter' | 'van' | 'truck') => setVehicleType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <CustomerVehicleFormSection 
                formData={formData}
                onUpdateField={updateFormData}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Adding..." : "Add Customer"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerQuickAdd;
