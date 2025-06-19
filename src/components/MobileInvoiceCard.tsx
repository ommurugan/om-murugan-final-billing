
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Printer, 
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  X
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
  showEmailButton = true
}: MobileInvoiceCardProps) => {
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      case 'draft': return 'outline';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'overdue': return <AlertCircle className="h-3 w-3" />;
      case 'draft': return <Edit className="h-3 w-3" />;
      case 'cancelled': return <X className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
              <p className="text-sm text-gray-600">{customerName}</p>
              <p className="text-xs text-gray-500">{vehicleInfo}</p>
            </div>
            <Badge variant={getStatusColor(invoice.status)} className="capitalize flex items-center gap-1">
              {getStatusIcon(invoice.status)}
              {invoice.status}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">₹{invoice.total.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => onView(invoice)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onEdit(invoice)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onPrint(invoice)}>
                <Printer className="h-4 w-4" />
              </Button>
              {showEmailButton && onEmail && (
                <Button size="sm" variant="ghost" onClick={() => onEmail(invoice)}>
                  <Mail className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onDelete(invoice.id)}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileInvoiceCard;
