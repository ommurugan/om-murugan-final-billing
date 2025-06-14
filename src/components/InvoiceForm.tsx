
import NonGSTInvoiceForm from "./NonGSTInvoiceForm";
import { Invoice } from "@/types/billing";

interface InvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const InvoiceForm = ({ onSave, onCancel, existingInvoice }: InvoiceFormProps) => {
  // For now, just render the NonGSTInvoiceForm
  // This can be expanded later to handle different invoice types
  return (
    <NonGSTInvoiceForm
      onSave={onSave}
      onCancel={onCancel}
      existingInvoice={existingInvoice}
    />
  );
};

export default InvoiceForm;
