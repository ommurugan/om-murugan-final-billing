
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { Customer } from "@/types/billing";
import { useGSTCustomerForm } from "@/hooks/useGSTCustomerForm";
import { useGSTCustomerSubmission } from "@/hooks/useGSTCustomerSubmission";
import GSTCustomerFormSection from "@/components/gst-customer/GSTCustomerFormSection";
import GSTVehicleFormSection from "@/components/gst-customer/GSTVehicleFormSection";

interface GSTCustomerQuickAddProps {
  onCustomerAdded: (customer: Customer) => void;
}

const GSTCustomerQuickAdd = ({ onCustomerAdded }: GSTCustomerQuickAddProps) => {
  const [open, setOpen] = useState(false);
  const { formData, updateFormData, resetForm, validateForm } = useGSTCustomerForm();
  const { submitForm, isLoading } = useGSTCustomerSubmission();

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
          Add GST Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New GST Customer
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <GSTCustomerFormSection 
              formData={formData}
              onUpdateField={updateFormData}
            />
            
            <GSTVehicleFormSection 
              formData={formData}
              onUpdateField={updateFormData}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add GST Customer"}
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

export default GSTCustomerQuickAdd;
