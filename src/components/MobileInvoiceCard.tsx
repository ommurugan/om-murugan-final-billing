
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Printer, 
  Mail,
  Check,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Receipt
} from "lucide-react";
import { Invoice } from "@/types/billing";

interface MobileInvoiceCardProps {
  invoice: Invoice;
  customerName: string;
  vehicleInfo: string;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: Invoice) => void;
  onEmail?: (invoice: Invoice) => void;
  showEmailButton?: boolean;
  onMarkAsPaid?: () => void;
}

const MobileInvoiceCard = ({
  invoice,
  customerName,
  vehicleInfo,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onEmail,
  showEmailButton = true,
  onMarkAsPaid
}: MobileInvoiceCardProps) => {
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {getStatusIcon(invoice.status)}
              </div>
              <div>
                <p className="font-semibold text-sm">{invoice.invoiceNumber}</p>
                <Badge className={`${getStatusColor(invoice.status)} text-xs`}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
            <p className="font-bold text-lg">₹{invoice.total.toFixed(2)}</p>
          </div>

          {/* Details */}
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Customer:</span> {customerName}</p>
            <p><span className="font-medium">Vehicle:</span> {vehicleInfo}</p>
            <p><span className="font-medium">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
            {invoice.dueDate && (
              <p><span className="font-medium">Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {onMarkAsPaid && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onMarkAsPaid}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark Paid
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onView(invoice)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(invoice)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onPrint(invoice)}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            {showEmailButton && onEmail && (
              <Button size="sm" variant="outline" onClick={() => onEmail(invoice)}>
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onDelete(invoice.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileInvoiceCard;
