
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, Car, Gauge, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Customer, Vehicle } from "@/types/billing";

interface CustomerVehicleSelectionProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  vehicles: Vehicle[];
  kilometers: number;
  onCustomerChange: (customer: Customer | null) => void;
  onVehicleChange: (vehicle: Vehicle | null) => void;
  onKilometersChange: (kilometers: number) => void;
  onCustomerAdded: (customer: Customer) => void;
  CustomerQuickAddComponent: React.ComponentType<{ onCustomerAdded: (customer: Customer) => void }>;
}

const CustomerVehicleSelection = ({
  customers,
  selectedCustomer,
  selectedVehicle,
  vehicles,
  kilometers,
  onCustomerChange,
  onVehicleChange,
  onKilometersChange,
  onCustomerAdded,
  CustomerQuickAddComponent
}: CustomerVehicleSelectionProps) => {
  // Filter vehicles by selected customer
  const customerVehicles = selectedCustomer 
    ? vehicles.filter(v => v.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Select Customer</Label>
              <CustomerQuickAddComponent onCustomerAdded={onCustomerAdded} />
            </div>
            <Select onValueChange={(value) => {
              const customer = customers.find(c => c.id === value);
              onCustomerChange(customer || null);
              onVehicleChange(null); // Reset vehicle selection when customer changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.length === 0 ? (
                  <SelectItem value="no-customers" disabled>
                    No customers found
                  </SelectItem>
                ) : (
                  customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          {selectedCustomer && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              {selectedCustomer.gstNumber && (
                <p className="text-sm text-blue-600 font-medium">GST: {selectedCustomer.gstNumber}</p>
              )}
              <Badge variant="secondary">
                Total Spent: ₹{selectedCustomer.totalSpent.toLocaleString()}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Select Vehicle</Label>
              {selectedCustomer && customerVehicles.length === 0 && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // TODO: Add functionality to create new vehicle for customer
                    console.log("Add new vehicle for customer:", selectedCustomer.id);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Vehicle
                </Button>
              )}
            </div>
            <Select 
              onValueChange={(value) => {
                const vehicle = customerVehicles.find(v => v.id === value);
                onVehicleChange(vehicle || null);
              }}
              disabled={!selectedCustomer}
              value={selectedVehicle?.id || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !selectedCustomer 
                    ? "Select a customer first" 
                    : customerVehicles.length === 0 
                      ? "No vehicles found - Add one first"
                      : "Choose a vehicle"
                } />
              </SelectTrigger>
              <SelectContent>
                {!selectedCustomer ? (
                  <SelectItem value="no-customer" disabled>
                    Select a customer first
                  </SelectItem>
                ) : customerVehicles.length === 0 ? (
                  <SelectItem value="no-vehicles" disabled>
                    No vehicles found for this customer
                  </SelectItem>
                ) : (
                  customerVehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex flex-col">
                        <span>{vehicle.make} {vehicle.model} - {vehicle.vehicleNumber}</span>
                        <span className="text-xs text-gray-500 capitalize">{vehicle.vehicleType}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          {selectedVehicle && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</p>
              <p className="text-sm text-gray-600">{selectedVehicle.vehicleNumber}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">{selectedVehicle.vehicleType}</Badge>
                {selectedVehicle.year && (
                  <Badge variant="outline">{selectedVehicle.year}</Badge>
                )}
                {selectedVehicle.color && (
                  <Badge variant="outline" className="capitalize">{selectedVehicle.color}</Badge>
                )}
              </div>
            </div>
          )}
          
          <div>
            <Label className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Current Kilometers
            </Label>
            <Input
              type="number"
              value={kilometers || ""}
              onChange={(e) => onKilometersChange(parseInt(e.target.value) || 0)}
              placeholder="Enter current kilometers"
              min="0"
              disabled={!selectedVehicle}
            />
            <p className="text-xs text-gray-500 mt-1">
              Record the vehicle's current kilometer reading for service history
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerVehicleSelection;
