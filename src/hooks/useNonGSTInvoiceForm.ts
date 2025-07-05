
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Customer, Vehicle, Invoice, InvoiceItem, Payment } from "@/types/billing";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";

interface UseNonGSTInvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

export const useNonGSTInvoiceForm = ({
  onSave,
  onCancel,
  existingInvoice
}: UseNonGSTInvoiceFormProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [kilometers, setKilometers] = useState<number>(0);

  // Fetch services and parts for the add functions
  const { data: servicesData = [] } = useServices();
  const { data: partsData = [] } = useParts();
  
  const createInvoiceMutation = useCreateInvoice();

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [laborCharges, setLaborCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Use custom hook for calculations (without extra charges for non-GST invoices)
  const { subtotal, total } = useInvoiceCalculations({
    invoiceItems,
    laborCharges,
    extraCharges: [],
    discount,
    taxRate
  });

  const addService = (serviceId: string) => {
    const service = servicesData.find(s => s.id === serviceId);
    if (service && !invoiceItems.find(item => item.itemId === serviceId && item.type === 'service')) {
      console.log("Adding service:", service.name, "with HSN code:", service.hsn_code);
      
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'service',
        itemId: service.id,
        name: service.name,
        quantity: 1,
        unitPrice: Number(service.base_price),
        discount: 0,
        total: Number(service.base_price),
        hsnCode: service.hsn_code || '' // Direct string assignment from database
      };
      setInvoiceItems([...invoiceItems, newItem]);
      console.log("Service added with HSN code:", service.hsn_code);
    }
  };

  const addPart = (partId: string) => {
    const part = partsData.find(p => p.id === partId);
    if (part && !invoiceItems.find(item => item.itemId === partId && item.type === 'part')) {
      console.log("Adding part:", part.name, "with HSN code:", part.hsn_code);
      
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'part',
        itemId: part.id,
        name: part.name,
        quantity: 1,
        unitPrice: Number(part.price),
        discount: 0,
        total: Number(part.price),
        hsnCode: part.hsn_code || '' // Direct string assignment from database
      };
      setInvoiceItems([...invoiceItems, newItem]);
      console.log("Part added with HSN code:", part.hsn_code);
    }
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setInvoiceItems(items => items.map(item => 
      item.id === itemId 
        ? { ...item, quantity, total: (item.unitPrice - item.discount) * quantity }
        : item
    ));
  };

  const updateItemDiscount = (itemId: string, discount: number) => {
    setInvoiceItems(items => items.map(item => 
      item.id === itemId 
        ? { ...item, discount, total: (item.unitPrice - discount) * item.quantity }
        : item
    ));
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const createInvoiceObject = (status: Invoice['status']) => {
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
      taxAmount: 0,
      extraCharges: [],
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

  const handleCustomerAdded = (customer: Customer) => {
    console.log("Customer added:", customer);
    setSelectedCustomer(customer);
  };

  useEffect(() => {
    setPaymentAmount(total);
  }, [total]);

  return {
    // State
    selectedCustomer,
    selectedVehicle,
    kilometers,
    invoiceItems,
    laborCharges,
    discount,
    taxRate,
    extraCharges: [],
    notes,
    paymentMethod,
    paymentAmount,
    showPrintPreview,
    subtotal,
    total,
    createInvoiceMutation,
    // Setters
    setSelectedCustomer,
    setSelectedVehicle,
    setKilometers,
    setLaborCharges,
    setDiscount,
    setTaxRate,
    setExtraCharges: () => {},
    setNotes,
    setPaymentMethod,
    setPaymentAmount,
    setShowPrintPreview,
    // Handlers
    addService,
    addPart,
    removeItem,
    updateItemQuantity,
    updateItemDiscount,
    createInvoiceObject,
    handleCustomerAdded
  };
};
