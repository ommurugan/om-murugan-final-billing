
import { toast } from "sonner";
import { Customer, Vehicle, Invoice } from "@/types/billing";
import InvoiceActionButtons from "./InvoiceActionButtons";

interface InvoiceFormActionsProps {
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  invoiceItems: any[];
  onSaveInvoice: (status: Invoice['status']) => void;
  onPrintPreview: () => void;
  onCancel: () => void;
}

const InvoiceFormActions = ({
  selectedCustomer,
  selectedVehicle,
  invoiceItems,
  onSaveInvoice,
  onPrintPreview,
  onCancel
}: InvoiceFormActionsProps) => {
  const handleSaveInvoice = (status: Invoice['status'] = 'draft') => {
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part");
      return;
    }
    onSaveInvoice(status);
  };

  const handlePrintPreview = () => {
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part to preview");
      return;
    }
    onPrintPreview();
  };

  return (
    <InvoiceActionButtons
      onSaveDraft={() => handleSaveInvoice('draft')}
      onCreateInvoice={() => handleSaveInvoice('sent')}
      onPrintPreview={handlePrintPreview}
      onCancel={onCancel}
    />
  );
};

export default InvoiceFormActions;
