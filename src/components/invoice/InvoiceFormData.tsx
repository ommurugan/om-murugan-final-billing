
import { useState, useEffect } from "react";
import { Customer, Vehicle, Invoice, Payment } from "@/types/billing";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import { useDataTransformations } from "@/hooks/useDataTransformations";
import CustomerVehicleSelection from "./CustomerVehicleSelection";
import ServicesPartsSelection from "./ServicesPartsSelection";
import AdditionalCharges from "./AdditionalCharges";
import PaymentSummary from "./PaymentSummary";

interface InvoiceFormDataProps {
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  kilometers: number;
  onCustomerChange: (customer: Customer | null) => void;
  onVehicleChange: (vehicle: Vehicle | null) => void;
  onKilometersChange: (kilometers: number) => void;
  onCustomerAdded: (customer: Customer) => void;
  CustomerQuickAddComponent: React.ComponentType<any>;
  invoiceItems: any[];
  onAddService: (serviceId: string) => void;
  onAddPart: (partId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItemQuantity: (itemId: string, quantity: number) => void;
  onUpdateItemDiscount: (itemId: string, discount: number) => void;
  laborCharges: number;
  extraCharges: Array<{name: string; amount: number}>;
  discount: number;
  taxRate: number;
  notes: string;
  paymentMethod: Payment['method'];
  paymentAmount: number;
  onLaborChargesChange: (charges: number) => void;
  onExtraChargesChange: (charges: Array<{name: string; amount: number}>) => void;
  onDiscountChange: (discount: number) => void;
  onTaxRateChange: (rate: number) => void;
  onNotesChange: (notes: string) => void;
  onPaymentMethodChange: (method: Payment['method']) => void;
  onPaymentAmountChange: (amount: number) => void;
  subtotal: number;
  total: number;
}

const InvoiceFormData = ({
  selectedCustomer,
  selectedVehicle,
  kilometers,
  onCustomerChange,
  onVehicleChange,
  onKilometersChange,
  onCustomerAdded,
  CustomerQuickAddComponent,
  invoiceItems,
  onAddService,
  onAddPart,
  onRemoveItem,
  onUpdateItemQuantity,
  onUpdateItemDiscount,
  laborCharges,
  extraCharges,
  discount,
  taxRate,
  notes,
  paymentMethod,
  paymentAmount,
  onLaborChargesChange,
  onExtraChargesChange,
  onDiscountChange,
  onTaxRateChange,
  onNotesChange,
  onPaymentMethodChange,
  onPaymentAmountChange,
  subtotal,
  total
}: InvoiceFormDataProps) => {
  const { data: customersData = [] } = useCustomers();
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch vehicles for the selected customer
  const { data: vehiclesData = [] } = useVehicles(selectedCustomer?.id);
  
  // Fetch services and parts
  const { data: servicesData = [] } = useServices();
  const { data: partsData = [] } = useParts();

  const { transformedVehicles, transformedServices, transformedParts } = useDataTransformations({
    vehiclesData,
    servicesData,
    partsData
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
    <div className="space-y-6">
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

      <ServicesPartsSelection
        services={transformedServices}
        parts={transformedParts}
        invoiceItems={invoiceItems}
        onAddService={onAddService}
        onAddPart={onAddPart}
        onRemoveItem={onRemoveItem}
        onUpdateItemQuantity={onUpdateItemQuantity}
        onUpdateItemDiscount={onUpdateItemDiscount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdditionalCharges
          laborCharges={laborCharges}
          extraCharges={extraCharges}
          discount={discount}
          taxRate={taxRate}
          notes={notes}
          onLaborChargesChange={onLaborChargesChange}
          onExtraChargesChange={onExtraChargesChange}
          onDiscountChange={onDiscountChange}
          onTaxRateChange={onTaxRateChange}
          onNotesChange={onNotesChange}
        />

        <PaymentSummary
          subtotal={subtotal}
          discount={discount}
          taxRate={taxRate}
          total={total}
          paymentMethod={paymentMethod}
          paymentAmount={paymentAmount}
          onPaymentMethodChange={onPaymentMethodChange}
          onPaymentAmountChange={onPaymentAmountChange}
        />
      </div>
    </div>
  );
};

export default InvoiceFormData;
