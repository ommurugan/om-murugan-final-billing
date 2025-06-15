
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

interface VehicleInfoSectionProps {
  vehicle: {
    vehicle_number: string;
    make: string;
    model: string;
    vehicle_type: string;
    year?: number;
    color?: string;
  };
}

const VehicleInfoSection = ({ vehicle }: VehicleInfoSectionProps) => {
  return (
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
  );
};

export default VehicleInfoSection;
