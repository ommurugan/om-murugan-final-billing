
import { Customer, Vehicle, Invoice, InvoiceItem, Payment } from "@/types/billing";

interface ExtraCharge {
  name: string;
  amount: number;
}

interface UseInvoiceCreationProps {
  selectedCustomer: Customer | null;
  selectedVehicle: Vehicle | null;
  invoiceItems: InvoiceItem[];
  laborCharges: number;
  extraCharges: ExtraCharge[];
  discount: number;
  taxRate: number;
  subtotal: number;
  total: number;
  notes: string;
  paymentMethod: Payment['method'];
  paymentAmount: number;
  kilometers: number;
  existingInvoice?: Invoice;
}

export const useInvoiceCreation = (props: UseInvoiceCreationProps) => {
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const createInvoiceObject = (status: Invoice['status']) => {
    const {
      selectedCustomer,
      selectedVehicle,
      invoiceItems,
      laborCharges,
      extraCharges,
      discount,
      taxRate,
      subtotal,
      total,
      notes,
      paymentMethod,
      paymentAmount,
      kilometers,
      existingInvoice
    } = props;

    const payment: Payment | undefined = paymentAmount > 0 ? {
      id: Date.now().toString(),
      invoiceId: "",
      amount: paymentAmount,
      method: paymentMethod,
      status: 'completed',
      paidAt: new Date().toISOString()
    } : undefined;

    return {
      id: existingInvoice?.id || Date.now().toString(),
      invoiceNumber: existingInvoice?.invoiceNumber || generateInvoiceNumber(),
      invoiceType: 'non-gst' as const,
      customerId: selectedCustomer!.id,
      vehicleId: selectedVehicle!.id,
      items: invoiceItems,
      subtotal,
      discount,
      taxRate,
      taxAmount: (subtotal - (subtotal * discount) / 100) * taxRate / 100,
      extraCharges,
      total,
      status: payment && payment.amount >= total ? 'paid' : status,
      createdAt: existingInvoice?.createdAt || new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: payment && payment.amount >= total ? new Date().toISOString() : undefined,
      notes,
      laborCharges,
      payments: payment ? [payment] : [],
      kilometers
    };
  };

  return {
    createInvoiceObject
  };
};
