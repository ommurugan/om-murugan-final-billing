
import { useState, useEffect } from "react";
import { Customer, Vehicle } from "@/types/billing";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useDataTransformations } from "@/hooks/useDataTransformations";
import CustomerVehicleSelection from "./CustomerVehicleSelection";

interface CustomerSectionProps {
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  kilometers: number;
  onCustomerChange: (customer: Customer | null) => void;
  onVehicleChange: (vehicle: Vehicle | null) => void;
  onKilometersChange: (kilometers: number) => void;
  onCustomerAdded: (customer: Customer) => void;
  CustomerQuickAddComponent: React.ComponentType<any>;
}

const CustomerSection = ({
  selectedCustomer,
  selectedVehicle,
  kilometers,
  onCustomerChange,
  onVehicleChange,
  onKilometersChange,
  onCustomerAdded,
  CustomerQuickAddComponent
}: CustomerSectionProps) => {
  const { data: customersData = [] } = useCustomers();
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch vehicles for the selected customer
  const { data: vehiclesData = [] } = useVehicles(selectedCustomer?.id);
  
  const { transformedVehicles } = useDataTransformations({
    vehiclesData,
    servicesData: [],
    partsData: []
  });

  // Update customers when data changes
  useEffect(() => {
    setCustomers(customersData);
  }, [customersData]);

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    onCustomerAdded(newCustomer);
  };

  return (
    <CustomerVehicleSelection
      customers={customers}
      selectedCustomer={selectedCustomer}
      selectedVehicle={selectedVehicle}
      vehicles={transformedVehicles}
      kilometers={kilometers}
      onCustomerChange={onCustomerChange}
      onVehicleChange={onVehicleChange}
      onKilometersChange={onKilometersChange}
      onCustomerAdded={handleCustomerAdded}
      CustomerQuickAddComponent={CustomerQuickAddComponent}
    />
  );
};

export default CustomerSection;
