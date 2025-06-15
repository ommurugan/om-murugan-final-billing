
import { Wrench, Receipt } from "lucide-react";
import ServiceHistoryItem from "./ServiceHistoryItem";

interface ServiceHistorySectionProps {
  serviceHistory: Array<{
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
  }>;
}

const ServiceHistorySection = ({ serviceHistory }: ServiceHistorySectionProps) => {
  return (
    <div className="bg-green-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-green-900">Service History ({serviceHistory.length} records)</h3>
      </div>
      
      {serviceHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No service history found for this vehicle.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {serviceHistory.map((invoice) => (
            <ServiceHistoryItem key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceHistorySection;
