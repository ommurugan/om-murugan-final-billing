
import { Settings, Package } from "lucide-react";

interface ServiceItem {
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
}

interface ServiceItemsDisplayProps {
  invoiceItems: ServiceItem[];
}

const ServiceItemsDisplay = ({ invoiceItems }: ServiceItemsDisplayProps) => {
  const serviceItems = invoiceItems?.filter(item => item.item_type === 'service') || [];
  const partItems = invoiceItems?.filter(item => item.item_type === 'part') || [];

  return (
    <div className="mt-4 space-y-3">
      {/* Services Section */}
      <div className="border-t pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-4 w-4 text-blue-600" />
          <h5 className="font-medium text-blue-900">Services Performed ({serviceItems.length})</h5>
        </div>
        {serviceItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {serviceItems.map((item) => (
              <div key={item.id} className="bg-blue-50 p-3 rounded">
                <p className="font-medium text-blue-900">
                  {item.services?.name || item.name}
                </p>
                {item.services?.category && (
                  <p className="text-sm text-blue-700">Category: {item.services.category}</p>
                )}
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × ₹{item.unit_price} = ₹{item.total}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No services recorded for this invoice</p>
        )}
      </div>

      {/* Parts Section */}
      <div className="border-t pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-4 w-4 text-orange-600" />
          <h5 className="font-medium text-orange-900">Parts Changed ({partItems.length})</h5>
        </div>
        {partItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {partItems.map((item) => (
              <div key={item.id} className="bg-orange-50 p-3 rounded">
                <p className="font-medium text-orange-900">
                  {item.parts?.name || item.name}
                </p>
                {item.parts && (
                  <div className="text-sm text-orange-700">
                    <p>Category: {item.parts.category}</p>
                    {item.parts.part_number && <p>Part #: {item.parts.part_number}</p>}
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × ₹{item.unit_price} = ₹{item.total}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No parts recorded for this invoice</p>
        )}
      </div>
    </div>
  );
};

export default ServiceItemsDisplay;
