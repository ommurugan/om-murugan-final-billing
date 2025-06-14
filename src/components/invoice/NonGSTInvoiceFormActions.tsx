
import { toast } from "sonner";
import { Customer, Vehicle, Invoice, InvoiceItem } from "@/types/billing";
import { UseMutationResult } from "@tanstack/react-query";

interface NonGSTInvoiceFormActionsProps {
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  invoiceItems: InvoiceItem[];
  createInvoiceObject: (status: Invoice['status']) => Invoice;
  createInvoiceMutation: UseMutationResult<any, Error, Omit<Invoice, "id" | "createdAt">, unknown>;
  onSave: (invoice: Invoice) => void;
}

export const useNonGSTInvoiceFormActions = ({
  selectedCustomer,
  selectedVehicle,
  invoiceItems,
  createInvoiceObject,
  createInvoiceMutation,
  onSave
}: NonGSTInvoiceFormActionsProps) => {
  const handleSaveDraft = async () => {
    console.log("Save Draft clicked");
    console.log("Selected customer:", selectedCustomer);
    console.log("Selected vehicle:", selectedVehicle);
    console.log("Invoice items:", invoiceItems);

    if (!selectedCustomer || !selectedVehicle) {
      toast.error("Please select customer and vehicle before saving draft");
      return;
    }

    try {
      const invoice = createInvoiceObject('draft');
      console.log("Created invoice object:", invoice);
      
      await createInvoiceMutation.mutateAsync(invoice);
      onSave(invoice);
      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  };

  const handleCreateInvoice = async () => {
    console.log("Create Invoice clicked");
    console.log("Selected customer:", selectedCustomer);
    console.log("Selected vehicle:", selectedVehicle);
    console.log("Invoice items:", invoiceItems);

    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part");
      return;
    }

    try {
      const invoice = createInvoiceObject('pending');
      console.log("Created invoice object:", invoice);
      
      await createInvoiceMutation.mutateAsync(invoice);
      onSave(invoice);
      toast.success("Non-GST Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  const handlePrintPreview = () => {
    console.log("Print Preview clicked");
    console.log("Selected customer:", selectedCustomer);
    console.log("Selected vehicle:", selectedVehicle);
    console.log("Invoice items:", invoiceItems);

    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part to preview");
      return;
    }
    return true; // Signal that preview should be shown
  };

  return {
    handleSaveDraft,
    handleCreateInvoice,
    handlePrintPreview
  };
};
