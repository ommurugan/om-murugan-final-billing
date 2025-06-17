
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Calendar, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PendingInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  vehicleInfo: string;
  amount: number;
  createdAt: string;
  status: string;
}

interface PendingInvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingInvoices: PendingInvoice[];
}

const PendingInvoicesModal = ({ isOpen, onClose, pendingInvoices }: PendingInvoicesModalProps) => {
  const navigate = useNavigate();

  const handleRegenerateBill = (invoiceId: string) => {
    // Navigate to invoices page with the specific invoice for editing
    navigate(`/invoices?edit=${invoiceId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Pending Invoices
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {pendingInvoices.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No pending invoices</p>
          ) : (
            pendingInvoices.map((invoice) => (
              <Card key={invoice.id} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Invoice #{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">{invoice.customerName}</p>
                        <p className="text-xs text-gray-500">{invoice.vehicleInfo}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold text-gray-900">₹{invoice.amount.toLocaleString()}</p>
                      <div className="flex flex-col gap-2">
                        <Badge 
                          variant="outline" 
                          className={
                            invoice.status === 'draft' 
                              ? "text-gray-600 border-gray-600" 
                              : "text-orange-600 border-orange-600"
                          }
                        >
                          {invoice.status === 'draft' ? 'Draft' : 'Pending'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRegenerateBill(invoice.id)}
                          className="text-xs"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingInvoicesModal;
