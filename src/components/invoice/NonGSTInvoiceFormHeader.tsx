
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/billing";

interface NonGSTInvoiceFormHeaderProps {
  selectedInvoice: Invoice | null;
  onBack: () => void;
}

const NonGSTInvoiceFormHeader = ({ selectedInvoice, onBack }: NonGSTInvoiceFormHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h2 className="text-xl md:text-2xl font-bold">
        {selectedInvoice ? 'Edit Non-GST Invoice' : 'Create New Non-GST Invoice'}
      </h2>
      <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
        Back to Non-GST Invoices
      </Button>
    </div>
  );
};

export default NonGSTInvoiceFormHeader;
