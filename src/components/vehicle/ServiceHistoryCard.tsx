
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Receipt, Phone, Mail } from "lucide-react";

interface ServiceRecord {
  id: string;
  invoice_number: string;
  created_at: string;
  total: number;
  status: string;
  customers?: {
    name: string;
    phone?: string;
    email?: string;
  };
  kilometers?: number;
}

interface ServiceHistoryCardProps {
  serviceHistory: ServiceRecord[];
}

const ServiceHistoryCard = ({ serviceHistory }: ServiceHistoryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Service History ({serviceHistory.length} records)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {serviceHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No service history found for this vehicle.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {serviceHistory.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{invoice.invoice_number}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{invoice.total.toFixed(2)}</p>
                    <Badge 
                      variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
                
                {invoice.customers && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{invoice.customers.name}</span>
                      </div>
                      {invoice.customers.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{invoice.customers.phone}</span>
                        </div>
                      )}
                      {invoice.customers.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{invoice.customers.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {invoice.kilometers && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Kilometers: {invoice.kilometers.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceHistoryCard;
