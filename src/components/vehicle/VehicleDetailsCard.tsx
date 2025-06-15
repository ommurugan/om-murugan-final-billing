
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import VehicleOwnerSection from "./VehicleOwnerSection";
import VehicleInfoSection from "./VehicleInfoSection";
import ServiceHistorySection from "./ServiceHistorySection";

interface SearchResult {
  vehicle: {
    vehicle_number: string;
    make: string;
    model: string;
    vehicle_type: string;
    year?: number;
    color?: string;
  };
  vehicleOwner: {
    name: string;
    phone?: string;
    email?: string;
  } | null;
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
  const { vehicle, vehicleOwner, serviceHistory } = searchResult;

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
          <VehicleOwnerSection owner={vehicleOwner} />
        )}

        {/* Vehicle Information Section */}
        <VehicleInfoSection vehicle={vehicle} />

        {/* Service History Section */}
        <ServiceHistorySection serviceHistory={serviceHistory} />
      </CardContent>
    </Card>
  );
};

export default VehicleDetailsCard;
