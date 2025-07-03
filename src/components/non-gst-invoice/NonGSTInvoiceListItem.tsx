
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Printer, Check } from "lucide-react";

interface NonGSTInvoiceListItemProps {
  invoice: any;
  onView: (invoice: any) => void;
  onEdit: (invoice: any) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: any) => void;
  onMarkAsPaid: (invoiceId: string) => void;
}

const NonGSTInvoiceListItem = ({
  invoice,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onMarkAsPaid
}: NonGSTInvoiceListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p><span className="font-medium">Customer:</span> {invoice.customer?.name || "Unknown"}</p>
              <p><span className="font-medium">Vehicle:</span> {invoice.vehicle?.vehicleNumber || "Unknown"}</p>
            </div>
            <div>
              <p><span className="font-medium">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p><span className="font-medium">Amount:</span> ₹{invoice.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMarkAsPaid(invoice.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Mark as Paid"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(invoice)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPrint(invoice)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(invoice)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(invoice.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NonGSTInvoiceListItem;
