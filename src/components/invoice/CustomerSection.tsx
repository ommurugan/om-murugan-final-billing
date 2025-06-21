
import CustomerVehicleSelection from "./CustomerVehicleSelection";
import { Customer, Vehicle } from "@/types/billing";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import CustomerQuickAdd from "../CustomerQuickAdd";

interface CustomerSectionProps {
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  kilometers: number;
  onCustomerChange: (customer: Customer | null) => void;
  onVehicleChange: (vehicle: Vehicle | null) => void;
  onKilometersChange: (kilometers: number) => void;
  onCustomerAdded: (customer: Customer) => void;
}

const CustomerSection = ({
  selectedCustomer,
  selectedVehicle,
  kilometers,
  onCustomerChange,
  onVehicleChange,
  onKilometersChange,
  onCustomerAdded
}: CustomerSectionProps) => {
  const { data: customersData = [] } = useCustomers();
  const { data: vehiclesData = [] } = useVehicles(selectedCustomer?.id);

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

  return (
    <CustomerVehicleSelection
      customers={customersData}
      selectedCustomer={selectedCustomer}
      selectedVehicle={selectedVehicle}
      vehicles={transformedVehicles}
      kilometers={kilometers}
      onCustomerChange={onCustomerChange}
      onVehicleChange={onVehicleChange}
      onKilometersChange={onKilometersChange}
      onCustomerAdded={onCustomerAdded}
      CustomerQuickAddComponent={CustomerQuickAdd}
    />
  );
};

export default CustomerSection;
