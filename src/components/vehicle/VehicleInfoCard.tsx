
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

interface VehicleInfoCardProps {
  vehicle: {
    vehicle_number: string;
    make: string;
    model: string;
    vehicle_type: string;
    year?: number;
    color?: string;
  };
}

const VehicleInfoCard = ({ vehicle }: VehicleInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Vehicle Number</p>
            <p className="font-semibold text-lg">{vehicle.vehicle_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Make & Model</p>
            <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Vehicle Type</p>
            <Badge variant="outline" className="capitalize">{vehicle.vehicle_type}</Badge>
          </div>
          {vehicle.year && (
            <div>
              <p className="text-sm text-gray-600">Year</p>
              <p className="font-semibold">{vehicle.year}</p>
            </div>
          )}
          {vehicle.color && (
            <div>
              <p className="text-sm text-gray-600">Color</p>
              <p className="font-semibold capitalize">{vehicle.color}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoCard;
