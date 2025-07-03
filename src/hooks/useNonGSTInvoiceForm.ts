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
    extraCharges: [], // Remove extra charges for non-GST invoices
    discount,
    taxRate
  });

  // Transform database services to match our interface
  const transformedServices = servicesData.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    basePrice: Number(s.base_price),
    estimatedTime: s.estimated_time,
    description: s.description,
    isActive: s.is_active,
    hsnCode: s.hsn_code // Include HSN code in transformation
  }));

  // Transform database parts to match our interface
  const transformedParts = partsData.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    stockQuantity: p.stock_quantity,
    minStockLevel: p.min_stock_level,
    supplier: p.supplier,
    partNumber: p.part_number,
    isActive: p.is_active,
    hsnCode: p.hsn_code // Include HSN code in transformation
  }));

  const addService = (serviceId: string) => {
    const service = transformedServices.find(s => s.id === serviceId);
    if (service && !invoiceItems.find(item => item.itemId === serviceId && item.type === 'service')) {
      console.log("Adding service with HSN code:", service.hsnCode);
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'service',
        itemId: service.id,
        name: service.name,
        quantity: 1,
        unitPrice: service.basePrice,
        discount: 0,
        total: service.basePrice,
        hsnCode: service.hsnCode // Use actual HSN code from service
      };
      setInvoiceItems([...invoiceItems, newItem]);
      console.log("Added service:", newItem);
    }
  };

  const addPart = (partId: string) => {
    const part = transformedParts.find(p => p.id === partId);
    if (part && !invoiceItems.find(item => item.itemId === partId && item.type === 'part')) {
      console.log("Adding part with HSN code:", part.hsnCode);
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'part',
        itemId: part.id,
        name: part.name,
        quantity: 1,
        unitPrice: part.price,
        discount: 0,
        total: part.price,
        hsnCode: part.hsnCode // Use actual HSN code from part
      };
      setInvoiceItems([...invoiceItems, newItem]);
      console.log("Added part:", newItem);
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
      extraCharges: [], // Remove extra charges for non-GST invoices
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
    extraCharges: [], // Remove extra charges for non-GST invoices
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
    setExtraCharges: () => {}, // No-op for non-GST invoices
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
