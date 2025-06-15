
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye,
  Edit,
  Printer,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from "lucide-react";
import { Invoice } from "@/types/billing";
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import { ImpactStyle } from "@capacitor/haptics";

interface MobileInvoiceCardProps {
  invoice: Invoice;
  customerName: string;
  vehicleInfo: string;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: Invoice) => void;
  onEmail: (invoice: Invoice) => void;
}

const MobileInvoiceCard = ({
  invoice,
  customerName,
  vehicleInfo,
  onEdit,
  onDelete,
  onPrint,
  onEmail
}: MobileInvoiceCardProps) => {
  const { triggerHaptic } = useMobileFeatures();

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
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleAction = async (action: () => void, hapticStyle: ImpactStyle = ImpactStyle.Light) => {
    await triggerHaptic(hapticStyle);
    action();
  };

  return (
    <Card className="mb-4 transition-all duration-200 hover:shadow-md active:scale-[0.98]">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {invoice.invoiceNumber}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{customerName}</p>
            <p className="text-xs text-gray-500">{vehicleInfo}</p>
          </div>
          <div className="text-right ml-4">
            <p className="font-bold text-lg text-gray-900 mb-1">
              ₹{invoice.total.toFixed(2)}
            </p>
            <Badge variant={getStatusColor(invoice.status)} className="capitalize">
              <div className="flex items-center gap-1">
                {getStatusIcon(invoice.status)}
                {invoice.status}
              </div>
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span>Created: {new Date(invoice.createdAt).toLocaleDateString()}</span>
          {invoice.status === 'overdue' && (
            <span className="text-red-500">
              Due: {new Date(invoice.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleAction(() => onEdit(invoice))} 
            className="h-12 flex flex-col gap-1 transition-all duration-150 active:scale-95"
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs">View</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleAction(() => onEdit(invoice))} 
            className="h-12 flex flex-col gap-1 transition-all duration-150 active:scale-95"
          >
            <Edit className="h-4 w-4" />
            <span className="text-xs">Edit</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleAction(() => onPrint(invoice))} 
            className="h-12 flex flex-col gap-1 transition-all duration-150 active:scale-95"
          >
            <Printer className="h-4 w-4" />
            <span className="text-xs">Print</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleAction(() => onDelete(invoice.id), ImpactStyle.Medium)}
            className="h-12 flex flex-col gap-1 text-red-500 hover:text-red-700 transition-all duration-150 active:scale-95"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-xs">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileInvoiceCard;
