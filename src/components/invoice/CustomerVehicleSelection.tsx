
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car, User, Gauge } from "lucide-react";
import { Customer, Vehicle } from "@/types/billing";
import CustomerQuickAdd from "../CustomerQuickAdd";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";

interface CustomerVehicleSelectionProps {
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  kilometers: number;
  onCustomerChange: (customer: Customer | null) => void;
  onVehicleChange: (vehicle: Vehicle | null) => void;
  onKilometersChange: (kilometers: number) => void;
}

const CustomerVehicleSelection = ({
  selectedCustomer,
  selectedVehicle,
  kilometers,
  onCustomerChange,
  onVehicleChange,
  onKilometersChange
}: CustomerVehicleSelectionProps) => {
  const { data: customersData = [] } = useCustomers();
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch vehicles for the selected customer
  const { data: vehiclesData = [] } = useVehicles(selectedCustomer?.id);

  // Update customers when data changes
  useEffect(() => {
    setCustomers(customersData);
  }, [customersData]);

  // Transform database vehicles to match our interface
  const transformedVehicles: Vehicle[] = vehiclesData.map(v => ({
    id: v.id,
    customerId: v.customer_id,
    make: v.make,
    model: v.model,
    year: v.year,
    vehicleNumber: v.vehicle_number,
    vehicleType: v.vehicle_type as 'car' | 'bike' | 'scooter' || 'car',
    engineNumber: v.engine_number,
    chassisNumber: v.chassis_number,
    color: v.color,
    createdAt: v.created_at
  }));

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    onCustomerChange(newCustomer);
  };

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
              <CustomerQuickAdd onCustomerAdded={handleCustomerAdded} />
            </div>
            <Select onValueChange={(value) => {
              const customer = customers.find(c => c.id === value);
              console.log("Customer selected:", customer);
              onCustomerChange(customer || null);
              onVehicleChange(null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedCustomer && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
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
            <Label>Select Vehicle</Label>
            <Select 
              onValueChange={(value) => {
                const vehicle = transformedVehicles.find(v => v.id === value);
                console.log("Vehicle selected:", vehicle);
                onVehicleChange(vehicle || null);
              }}
              disabled={!selectedCustomer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {transformedVehicles.length === 0 ? (
                  <SelectItem value="no-vehicles" disabled>
                    No vehicles found for this customer
                  </SelectItem>
                ) : (
                  transformedVehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.vehicleNumber}
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
              <Badge variant="secondary">{selectedVehicle.vehicleType}</Badge>
            </div>
          )}
          
          {selectedVehicle && (
            <div className="mt-4">
              <Label className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Current Kilometers
              </Label>
              <Input
                type="number"
                value={kilometers}
                onChange={(e) => onKilometersChange(parseInt(e.target.value) || 0)}
                placeholder="Enter current kilometers"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Record the vehicle's current kilometer reading
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerVehicleSelection;
