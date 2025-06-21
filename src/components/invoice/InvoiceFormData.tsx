
import { Customer, Vehicle, Payment } from "@/types/billing";
import CustomerSection from "./CustomerSection";
import ServicesSection from "./ServicesSection";
import PaymentSection from "./PaymentSection";

interface InvoiceFormDataProps {
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  kilometers: number;
  onCustomerChange: (customer: Customer | null) => void;
  onVehicleChange: (vehicle: Vehicle | null) => void;
  onKilometersChange: (kilometers: number) => void;
  onCustomerAdded: (customer: Customer) => void;
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
  return (
    <div className="space-y-6">
      <CustomerSection
        selectedCustomer={selectedCustomer}
        selectedVehicle={selectedVehicle}
        kilometers={kilometers}
        onCustomerChange={onCustomerChange}
        onVehicleChange={onVehicleChange}
        onKilometersChange={onKilometersChange}
        onCustomerAdded={onCustomerAdded}
      />

      <ServicesSection
        invoiceItems={invoiceItems}
        onAddService={onAddService}
        onAddPart={onAddPart}
        onRemoveItem={onRemoveItem}
        onUpdateItemQuantity={onUpdateItemQuantity}
        onUpdateItemDiscount={onUpdateItemDiscount}
      />

      <PaymentSection
        laborCharges={laborCharges}
        extraCharges={extraCharges}
        discount={discount}
        taxRate={taxRate}
        notes={notes}
        paymentMethod={paymentMethod}
        paymentAmount={paymentAmount}
        onLaborChargesChange={onLaborChargesChange}
        onExtraChargesChange={onExtraChargesChange}
        onDiscountChange={onDiscountChange}
        onTaxRateChange={onTaxRateChange}
        onNotesChange={onNotesChange}
        onPaymentMethodChange={onPaymentMethodChange}
        onPaymentAmountChange={onPaymentAmountChange}
        subtotal={subtotal}
        total={total}
      />
    </div>
  );
};

export default InvoiceFormData;
