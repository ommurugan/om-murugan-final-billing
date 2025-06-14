
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Receipt, Plus } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";

const RecentActivity = () => {
  const navigate = useNavigate();
  const { data: invoices = [] } = useInvoices();
  const { data: customers = [] } = useCustomers();

  const hasData = invoices.length > 0 || customers.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest service updates and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-4">
            {invoices.slice(0, 4).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Invoice #{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">{invoice.invoiceType} • {invoice.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{invoice.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
            <p className="text-gray-500 mb-4">
              Start by creating your first invoice or adding customers to see activity here.
            </p>
            <Button onClick={() => navigate('/invoices')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create First Invoice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
