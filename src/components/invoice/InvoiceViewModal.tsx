
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice, Customer, Vehicle } from "@/types/billing";
import { Edit, Printer, X } from "lucide-react";

interface InvoiceViewModalProps {
  invoice: Invoice;
  customer?: Customer;
  vehicle?: Vehicle;
  onClose: () => void;
  onEdit: () => void;
  onPrint: () => void;
}

const InvoiceViewModal = ({
  invoice,
  customer,
  vehicle,
  onClose,
  onEdit,
  onPrint
}: InvoiceViewModalProps) => {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">
              Invoice Details - {invoice.invoiceNumber}
            </DialogTitle>
            <div className="flex gap-2">
              <Button onClick={onEdit} size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={onPrint} size="sm" variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={onClose} size="sm" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Invoice Number</p>
                <p className="font-medium">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{invoice.invoiceType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={getStatusColor(invoice.status)} className="capitalize">
                  {invoice.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{customer?.name || 'Unknown Customer'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer?.phone || 'N/A'}</p>
                </div>
                {customer?.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                )}
                {customer?.gstNumber && (
                  <div>
                    <p className="text-sm text-gray-500">GST Number</p>
                    <p className="font-medium">{customer.gstNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">
                    {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Number</p>
                  <p className="font-medium">{vehicle?.vehicleNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{vehicle?.vehicleType || 'N/A'}</p>
                </div>
                {invoice.kilometers && (
                  <div>
                    <p className="text-sm text-gray-500">Kilometers</p>
                    <p className="font-medium">{invoice.kilometers.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items & Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Rate</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Discount</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.unitPrice.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.discount.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                    {invoice.laborCharges > 0 && (
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Labor Charges</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{invoice.laborCharges.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹0.00</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">₹{invoice.laborCharges.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-md ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-₹{invoice.discount.toFixed(2)}</span>
                  </div>
                )}
                {invoice.taxAmount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>CGST ({invoice.taxRate / 2}%):</span>
                      <span>₹{(invoice.taxAmount / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST ({invoice.taxRate / 2}%):</span>
                      <span>₹{(invoice.taxAmount / 2).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewModal;
