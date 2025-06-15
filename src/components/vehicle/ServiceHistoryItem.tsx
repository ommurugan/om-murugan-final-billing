
import { Badge } from "@/components/ui/badge";
import ServiceItemsDisplay from "./ServiceItemsDisplay";

interface ServiceHistoryItemProps {
  invoice: {
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
    invoice_items?: Array<{
      id: string;
      name: string;
      quantity: number;
      unit_price: number;
      total: number;
      item_type: string;
      services?: {
        name: string;
        category: string;
      };
      parts?: {
        name: string;
        category: string;
        part_number?: string;
      };
    }>;
  };
}

const ServiceHistoryItem = ({ invoice }: ServiceHistoryItemProps) => {
  // Log invoice items for debugging
  console.log('Invoice items for', invoice.invoice_number, ':', invoice.invoice_items);

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-lg">{invoice.invoice_number}</p>
          <p className="text-sm text-gray-600">
            {new Date(invoice.created_at).toLocaleDateString()}
          </p>
          {invoice.kilometers && (
            <p className="text-sm text-gray-600">
              Kilometers: {invoice.kilometers.toLocaleString()}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold text-xl text-green-600">₹{invoice.total.toFixed(2)}</p>
          <Badge 
            variant={invoice.status === 'paid' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {invoice.status}
          </Badge>
        </div>
      </div>

      {/* Services and Parts Details */}
      {invoice.invoice_items && (
        <ServiceItemsDisplay invoiceItems={invoice.invoice_items} />
      )}
    </div>
  );
};

export default ServiceHistoryItem;
