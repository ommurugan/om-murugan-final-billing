
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Printer, 
  Eye,
  Edit,
  Trash2,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";
import { Invoice, Customer, Vehicle } from "@/types/billing";

interface InvoiceListProps {
  invoices: Invoice[];
  customers: Customer[];
  vehicles: Vehicle[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: Invoice) => void;
  onCreateFirst: () => void;
  showEmailButton?: boolean;
}

const InvoiceList = ({
  invoices,
  customers,
  vehicles,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onCreateFirst,
  showEmailButton = true
}: InvoiceListProps) => {
  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || "Unknown Customer";
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle";
  };

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
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hidden md:block">
      <CardHeader>
        <CardTitle>Non-GST Invoices ({invoices.length})</CardTitle>
        <CardDescription>Manage and track all your non-GST invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No non-GST invoices found</p>
              <Button 
                onClick={onCreateFirst} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Create First Non-GST Invoice
              </Button>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(invoice.status)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">
                      {getCustomerName(invoice.customerId)} • {getVehicleInfo(invoice.vehicleId)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(invoice.createdAt).toLocaleDateString()}
                      {invoice.status === 'overdue' && (
                        <span className="text-red-500 ml-2">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{invoice.total.toFixed(2)}</p>
                    <Badge variant={getStatusColor(invoice.status)} className="capitalize">
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => onView(invoice)} title="View Invoice">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onEdit(invoice)} title="Edit Invoice">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onPrint(invoice)} title="Print Invoice">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onDelete(invoice.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Invoice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
