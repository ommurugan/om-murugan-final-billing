
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NonGSTInvoiceHeaderProps {
  onCreateInvoice: () => void;
}

const NonGSTInvoiceHeader = ({ onCreateInvoice }: NonGSTInvoiceHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Non-GST Invoices</h2>
        <p className="text-gray-600">Manage your non-GST invoices</p>
      </div>
      <Button onClick={onCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="h-4 w-4 mr-2" />
        New Invoice
      </Button>
    </div>
  );
};

export default NonGSTInvoiceHeader;
