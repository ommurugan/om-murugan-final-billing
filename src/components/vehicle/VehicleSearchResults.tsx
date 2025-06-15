
import { Card, CardContent } from "@/components/ui/card";
import { Car } from "lucide-react";
import VehicleDetailsCard from "./VehicleDetailsCard";

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

interface VehicleSearchResultsProps {
  searchResult: SearchResult | null;
  searchTerm: string;
  isLoading: boolean;
  error: any;
  hasSearched: boolean;
}

const VehicleSearchResults = ({ 
  searchResult, 
  searchTerm, 
  isLoading, 
  error, 
  hasSearched 
}: VehicleSearchResultsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Searching for vehicle...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && hasSearched) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-600">
            <p>Error searching for vehicle. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && hasSearched && !searchResult && !error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <Car className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No vehicle found</p>
            <p>No vehicle found with number "{searchTerm}". Please check the number and try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (searchResult && searchResult.vehicle) {
    return <VehicleDetailsCard searchResult={searchResult} />;
  }

  return null;
};

export default VehicleSearchResults;
