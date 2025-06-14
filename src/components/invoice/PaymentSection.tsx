
import { Payment } from "@/types/billing";
import AdditionalCharges from "./AdditionalCharges";
import PaymentSummary from "./PaymentSummary";

interface PaymentSectionProps {
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

const PaymentSection = ({
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
}: PaymentSectionProps) => {
  return (
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
  );
};

export default PaymentSection;
