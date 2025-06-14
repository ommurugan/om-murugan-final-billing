
import { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import StandardHeader from "@/components/StandardHeader";
import { useVehicles } from "@/hooks/useVehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Car, Search } from "lucide-react";

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: vehicles = [], isLoading } = useVehicles();

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <StandardHeader title="Vehicles">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StandardHeader>
    );
  }

  return (
    <StandardHeader title="Vehicles">
      <div className="w-full">
        <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-full">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search vehicles by number, make, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{vehicles.length}</p>
                  <p className="text-sm text-gray-600">Total Vehicles</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicles List */}
          <div className="space-y-4">
            {filteredVehicles.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vehicles Found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? "No vehicles match your search criteria." : "No vehicles have been added yet."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-blue-600" />
                      {vehicle.vehicle_number}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Make</p>
                        <p className="font-medium">{vehicle.make}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Model</p>
                        <p className="font-medium">{vehicle.model}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium capitalize">{vehicle.vehicle_type}</p>
                      </div>
                      {vehicle.year && (
                        <div>
                          <p className="text-gray-600">Year</p>
                          <p className="font-medium">{vehicle.year}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </StandardHeader>
  );
};

export default Vehicles;
