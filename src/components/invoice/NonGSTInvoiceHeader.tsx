
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NonGSTInvoiceHeaderProps {
  onCreateInvoice: () => void;
}

const NonGSTInvoiceHeader = ({ onCreateInvoice }: NonGSTInvoiceHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Non-GST Invoice Management</h1>
        <p className="text-sm md:text-base text-gray-600">Create and manage non-GST invoices</p>
      </div>
      <Button onClick={onCreateInvoice} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        New Non-GST Invoice
      </Button>
    </div>
  );
};

export default NonGSTInvoiceHeader;
