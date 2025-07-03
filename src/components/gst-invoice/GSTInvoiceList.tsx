
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
  X,
  Check
} from "lucide-react";
import { Invoice } from "@/types/billing";
import MobileInvoiceCard from "../MobileInvoiceCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GSTInvoiceListProps {
  invoices: any[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: Invoice) => void;
  onCreateFirst: () => void;
  getCustomerName: (invoice: any) => string;
  getCustomerGST: (invoice: any) => string;
  getVehicleInfo: (invoice: any) => string;
  onRefresh?: () => void;
}

const GSTInvoiceList = ({
  invoices,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onCreateFirst,
  getCustomerName,
  getCustomerGST,
  getVehicleInfo,
  onRefresh
}: GSTInvoiceListProps) => {
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

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      if (error) throw error;

      if (onRefresh) {
        onRefresh();
      }
      toast.success("Invoice marked as paid!");
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to mark invoice as paid");
    }
  };

  return (
    <>
      {/* Desktop Invoices List */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>GST Invoices ({invoices.length})</CardTitle>
          <CardDescription>Manage and track all your GST invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No GST invoices found</p>
                <Button 
                  onClick={onCreateFirst} 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Create First GST Invoice
                </Button>
              </div>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(invoice.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">
                        {getCustomerName(invoice)} • {getVehicleInfo(invoice)}
                      </p>
                      <p className="text-xs text-gray-500">
                        GST: {getCustomerGST(invoice)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(invoice.createdAt).toLocaleDateString()}
                        {invoice.kilometers && (
                          <span className="ml-2">• KM: {invoice.kilometers.toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{invoice.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Tax: ₹{invoice.taxAmount.toFixed(2)}</p>
                      <Badge variant={getStatusColor(invoice.status)} className="capitalize">
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {invoice.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleMarkAsPaid(invoice.id)} 
                          title="Mark as Paid"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
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

      {/* Mobile Invoices List */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">GST Invoices ({invoices.length})</h3>
        </div>
        
        {invoices.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No GST invoices found</p>
                <Button 
                  onClick={onCreateFirst} 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  Create First GST Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <MobileInvoiceCard
                key={invoice.id}
                invoice={invoice}
                customerName={getCustomerName(invoice)}
                vehicleInfo={getVehicleInfo(invoice)}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onPrint={onPrint}
                showEmailButton={false}
                onMarkAsPaid={invoice.status === 'pending' ? () => handleMarkAsPaid(invoice.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GSTInvoiceList;
