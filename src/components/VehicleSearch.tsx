import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Car, Calendar, Wrench, Receipt, Phone, Mail, User } from "lucide-react";
import { useVehicleSearch } from "@/hooks/useVehicleSearch";

const VehicleSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const { data: searchResult, isLoading, error } = useVehicleSearch(searchTerm);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setHasSearched(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get the owner information from the most recent service record
  const getVehicleOwner = () => {
    if (searchResult?.serviceHistory && searchResult.serviceHistory.length > 0) {
      return searchResult.serviceHistory[0].customers;
    }
    return null;
  };

  const vehicleOwner = getVehicleOwner();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Vehicle Search
          </CardTitle>
          <CardDescription>
            Search for vehicles by number to view service history and customer details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter vehicle number (e.g., TN 01 AB 1234)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Searching for vehicle...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {error && hasSearched && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-red-600">
              <p>Error searching for vehicle. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && hasSearched && !searchResult && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <Car className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No vehicle found</p>
              <p>No vehicle found with number "{searchTerm}". Please check the number and try again.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {searchResult && searchResult.vehicle && (
        <div className="space-y-6">
          {/* Vehicle Owner Information */}
          {vehicleOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Vehicle Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900">{vehicleOwner.name}</h3>
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
              </CardContent>
            </Card>
          )}

          {/* Vehicle Information */}
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
                  <p className="font-semibold text-lg">{searchResult.vehicle.vehicle_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Make & Model</p>
                  <p className="font-semibold">{searchResult.vehicle.make} {searchResult.vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vehicle Type</p>
                  <Badge variant="outline" className="capitalize">{searchResult.vehicle.vehicle_type}</Badge>
                </div>
                {searchResult.vehicle.year && (
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold">{searchResult.vehicle.year}</p>
                  </div>
                )}
                {searchResult.vehicle.color && (
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold capitalize">{searchResult.vehicle.color}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Service History ({searchResult.serviceHistory.length} records)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResult.serviceHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No service history found for this vehicle.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResult.serviceHistory.map((invoice: any) => (
                    <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{invoice.invoice_number}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{invoice.total.toFixed(2)}</p>
                          <Badge 
                            variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {invoice.customers && (
                        <div className="mt-3 pt-3 border-t">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{invoice.customers.name}</span>
                            </div>
                            {invoice.customers.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{invoice.customers.phone}</span>
                              </div>
                            )}
                            {invoice.customers.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{invoice.customers.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {invoice.kilometers && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span>Kilometers: {invoice.kilometers.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VehicleSearch;
