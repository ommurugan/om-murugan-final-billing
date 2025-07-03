
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface NonGSTInvoiceEmptyStateProps {
  searchTerm: string;
  statusFilter: string;
  onCreateInvoice: () => void;
}

const NonGSTInvoiceEmptyState = ({ 
  searchTerm, 
  statusFilter, 
  onCreateInvoice 
}: NonGSTInvoiceEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
      <p className="text-gray-500 mb-4">
        {searchTerm || statusFilter !== "all" 
          ? "No invoices match your search criteria." 
          : "Get started by creating your first invoice."
        }
      </p>
      {!searchTerm && statusFilter === "all" && (
        <Button onClick={onCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      )}
    </div>
  );
};

export default NonGSTInvoiceEmptyState;
