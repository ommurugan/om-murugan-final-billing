
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Customer, Vehicle } from "@/types/billing";
import GSTCustomerQuickAdd from "../GSTCustomerQuickAdd";

interface GSTCustomerSelectionProps {
  customers: Customer[];
  vehicles: Vehicle[];
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  kilometers: number;
  onCustomerChange: (customer: Customer | null) => void;
  onVehicleChange: (vehicle: Vehicle | null) => void;
  onKilometersChange: (km: number) => void;
  onCustomerAdded: (customer: Customer) => void;
}

const GSTCustomerSelection = ({
  customers,
  vehicles,
  selectedCustomer,
  selectedVehicle,
  kilometers,
  onCustomerChange,
  onVehicleChange,
  onKilometersChange,
  onCustomerAdded
}: GSTCustomerSelectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="customer">Customer</Label>
          <Select 
            value={selectedCustomer?.id || ""} 
            onValueChange={(value) => {
              const customer = customers.find(c => c.id === value);
              onCustomerChange(customer || null);
              onVehicleChange(null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.filter(c => c.gstNumber).map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} - {customer.gstNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <GSTCustomerQuickAdd onCustomerAdded={onCustomerAdded} />
      </div>

      {selectedCustomer && (
        <div>
          <Label htmlFor="vehicle">Vehicle</Label>
          <Select 
            value={selectedVehicle?.id || ""} 
            onValueChange={(value) => {
              const vehicle = vehicles.find(v => v.id === value && v.customerId === selectedCustomer.id);
              onVehicleChange(vehicle || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles
                .filter(v => v.customerId === selectedCustomer.id)
                .map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.vehicleNumber}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="kilometers">Current Kilometers</Label>
        <Input
          id="kilometers"
          type="number"
          value={kilometers}
          onChange={(e) => onKilometersChange(Number(e.target.value))}
          placeholder="Enter current kilometers"
        />
      </div>
    </div>
  );
};

export default GSTCustomerSelection;
