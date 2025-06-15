
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Customer } from "@/types/billing";
import { useCustomerForm } from "@/hooks/useCustomerForm";
import { useCustomerSubmission } from "@/hooks/useCustomerSubmission";
import CustomerFormSection from "@/components/customer/CustomerFormSection";
import CustomerVehicleFormSection from "@/components/customer/CustomerVehicleFormSection";

interface CustomerQuickAddProps {
  onCustomerAdded: (customer: Customer) => void;
}

const CustomerQuickAdd = ({ onCustomerAdded }: CustomerQuickAddProps) => {
  const [open, setOpen] = useState(false);
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
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomerFormSection 
              formData={formData}
              onUpdateField={updateFormData}
            />
            
            <CustomerVehicleFormSection 
              formData={formData}
              onUpdateField={updateFormData}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Customer"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerQuickAdd;
