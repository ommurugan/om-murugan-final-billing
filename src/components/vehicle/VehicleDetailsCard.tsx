
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, User, Phone, Mail, Wrench, Receipt, Settings, Package } from "lucide-react";

interface SearchResult {
  vehicle: {
    vehicle_number: string;
    make: string;
    model: string;
    vehicle_type: string;
    year?: number;
    color?: string;
  };
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

interface VehicleDetailsCardProps {
  searchResult: SearchResult;
}

const VehicleDetailsCard = ({ searchResult }: VehicleDetailsCardProps) => {
  const { vehicle, serviceHistory } = searchResult;
  
  // Get the owner information from the most recent service record
  const vehicleOwner = serviceHistory && serviceHistory.length > 0 ? serviceHistory[0].customers : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Car className="h-6 w-6" />
          Vehicle Details & Service History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Owner Section */}
        {vehicleOwner && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Vehicle Owner</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-900">{vehicleOwner.name}</h4>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-700">
                  {vehicleOwner.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{vehicleOwner.phone}</span>
                    </div>
                  )}
                  {vehicleOwner.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{vehicleOwner.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Information Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Car className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Vehicle Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Vehicle Number</p>
              <p className="font-semibold text-lg text-gray-900">{vehicle.vehicle_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Make & Model</p>
              <p className="font-semibold text-gray-900">{vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vehicle Type</p>
              <Badge variant="outline" className="capitalize">{vehicle.vehicle_type}</Badge>
            </div>
            {vehicle.year && (
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold text-gray-900">{vehicle.year}</p>
              </div>
            )}
            {vehicle.color && (
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className="font-semibold capitalize text-gray-900">{vehicle.color}</p>
              </div>
            )}
          </div>
        </div>

        {/* Service History Section */}
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
              {serviceHistory.map((invoice) => {
                // Log invoice items for debugging
                console.log('Invoice items for', invoice.invoice_number, ':', invoice.invoice_items);
                
                const serviceItems = invoice.invoice_items?.filter(item => item.item_type === 'service') || [];
                const partItems = invoice.invoice_items?.filter(item => item.item_type === 'part') || [];
                
                console.log('Service items:', serviceItems);
                console.log('Part items:', partItems);
                
                return (
                  <div key={invoice.id} className="bg-white border rounded-lg p-4 shadow-sm">
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDetailsCard;
