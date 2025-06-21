
import GSTInvoiceForm from "../GSTInvoiceForm";
import { Invoice } from "@/types/billing";
import { InvoiceWithDetails } from "@/types/invoiceWithDetails";

interface GSTInvoiceCreateFormProps {
  selectedInvoice: InvoiceWithDetails | null;
  onSave: (invoice: Invoice) => Promise<void>;
  onCancel: () => void;
}

const GSTInvoiceCreateForm = ({ selectedInvoice, onSave, onCancel }: GSTInvoiceCreateFormProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">
          {selectedInvoice ? 'Edit GST Invoice' : 'Create New GST Invoice'}
        </h2>
        <button 
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to GST Invoices
        </button>
      </div>
      
      <GSTInvoiceForm 
        onSave={onSave}
        onCancel={onCancel}
        existingInvoice={selectedInvoice || undefined}
      />
    </div>
  );
};

export default GSTInvoiceCreateForm;
