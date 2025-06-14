
import { useMemo } from "react";
import { InvoiceItem } from "@/types/billing";

interface ExtraCharge {
  name: string;
  amount: number;
}

interface UseInvoiceCalculationsProps {
  invoiceItems: InvoiceItem[];
  laborCharges: number;
  extraCharges: ExtraCharge[];
  discount: number;
  taxRate: number;
}

export const useInvoiceCalculations = ({
  invoiceItems,
  laborCharges,
  extraCharges,
  discount,
  taxRate
}: UseInvoiceCalculationsProps) => {
  const subtotal = useMemo(() => {
    const itemsTotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const extraTotal = extraCharges.reduce((sum, charge) => sum + charge.amount, 0);
    return itemsTotal + laborCharges + extraTotal;
  }, [invoiceItems, laborCharges, extraCharges]);

  const total = useMemo(() => {
    const discountAmount = subtotal * discount / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * taxRate / 100;
    return afterDiscount + taxAmount;
  }, [subtotal, discount, taxRate]);

  return { subtotal, total };
};
