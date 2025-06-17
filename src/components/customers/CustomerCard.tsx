
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Edit, Trash2, Car, FileText } from "lucide-react";
import { Customer } from "@/types/billing";
import { useVehicles } from "@/hooks/useVehicles";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerCard = ({ customer, onEdit, onDelete }: CustomerCardProps) => {
  const { data: vehiclesData = [] } = useVehicles(customer.id);

  const vehicles = vehiclesData.map(v => ({
    id: v.id,
    make: v.make,
    model: v.model,
    vehicleNumber: v.vehicle_number,
    vehicleType: v.vehicle_type
  }));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
            {customer.gstNumber && (
              <div className="flex items-center gap-2 mt-1">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  GST: {customer.gstNumber}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(customer)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(customer.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span className="text-sm">{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{customer.email}</span>
            </div>
          )}
          {customer.address && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{customer.address}</span>
            </div>
          )}
        </div>

        {/* Vehicles Section */}
        {vehicles.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Car className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Vehicles</span>
            </div>
            <div className="space-y-1">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="text-xs bg-gray-50 p-2 rounded">
                  <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                  <span className="text-gray-600 ml-2">• {vehicle.vehicleNumber}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {vehicle.vehicleType}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Badge variant="secondary">
            Total Spent: ₹{customer.totalSpent?.toLocaleString() || '0'}
          </Badge>
          <span className="text-xs text-gray-500">
            {new Date(customer.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
