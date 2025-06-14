
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Customer, Vehicle, Invoice, InvoiceItem, Payment } from "@/types/billing";
import InvoicePrintPreview from "./InvoicePrintPreview";
import CustomerSection from "./invoice/CustomerSection";
import ServicesSection from "./invoice/ServicesSection";
import PaymentSection from "./invoice/PaymentSection";
import InvoiceActionButtons from "./invoice/InvoiceActionButtons";
import CustomerQuickAdd from "./CustomerQuickAdd";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";

interface NonGSTInvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const NonGSTInvoiceForm = ({
  onSave,
  onCancel,
  existingInvoice
}: NonGSTInvoiceFormProps) => {
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
  const [extraCharges, setExtraCharges] = useState<Array<{
    name: string;
    amount: number;
  }>>([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Use custom hook for calculations
  const { subtotal, total } = useInvoiceCalculations({
    invoiceItems,
    laborCharges,
    extraCharges,
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
    isActive: s.is_active
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
    isActive: p.is_active
  }));

  const addService = (serviceId: string) => {
    const service = transformedServices.find(s => s.id === serviceId);
    if (service && !invoiceItems.find(item => item.itemId === serviceId && item.type === 'service')) {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'service',
        itemId: service.id,
        name: service.name,
        quantity: 1,
        unitPrice: service.basePrice,
        discount: 0,
        total: service.basePrice
      };
      setInvoiceItems([...invoiceItems, newItem]);
      console.log("Added service:", newItem);
    }
  };

  const addPart = (partId: string) => {
    const part = transformedParts.find(p => p.id === partId);
    if (part && !invoiceItems.find(item => item.itemId === partId && item.type === 'part')) {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        type: 'part',
        itemId: part.id,
        name: part.name,
        quantity: 1,
        unitPrice: part.price,
        discount: 0,
        total: part.price
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

  const handleSaveDraft = async () => {
    console.log("Save Draft clicked");
    console.log("Selected customer:", selectedCustomer);
    console.log("Selected vehicle:", selectedVehicle);
    console.log("Invoice items:", invoiceItems);

    if (!selectedCustomer || !selectedVehicle) {
      toast.error("Please select customer and vehicle before saving draft");
      return;
    }

    try {
      const invoice = createInvoiceObject('draft');
      console.log("Created invoice object:", invoice);
      
      await createInvoiceMutation.mutateAsync(invoice);
      onSave(invoice);
      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  };

  const handleCreateInvoice = async () => {
    console.log("Create Invoice clicked");
    console.log("Selected customer:", selectedCustomer);
    console.log("Selected vehicle:", selectedVehicle);
    console.log("Invoice items:", invoiceItems);

    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part");
      return;
    }

    try {
      const invoice = createInvoiceObject('pending');
      console.log("Created invoice object:", invoice);
      
      await createInvoiceMutation.mutateAsync(invoice);
      onSave(invoice);
      toast.success("Non-GST Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  const handlePrintPreview = () => {
    console.log("Print Preview clicked");
    console.log("Selected customer:", selectedCustomer);
    console.log("Selected vehicle:", selectedVehicle);
    console.log("Invoice items:", invoiceItems);

    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part to preview");
      return;
    }
    setShowPrintPreview(true);
  };

  const handleCustomerAdded = (customer: Customer) => {
    console.log("Customer added:", customer);
    setSelectedCustomer(customer);
  };

  useEffect(() => {
    setPaymentAmount(total);
  }, [total]);

  if (showPrintPreview && selectedCustomer && selectedVehicle) {
    const previewInvoice = createInvoiceObject('draft');
    return (
      <InvoicePrintPreview
        invoice={previewInvoice}
        customer={selectedCustomer}
        vehicle={selectedVehicle}
        onClose={() => setShowPrintPreview(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CustomerSection
        selectedCustomer={selectedCustomer}
        selectedVehicle={selectedVehicle}
        kilometers={kilometers}
        onCustomerChange={setSelectedCustomer}
        onVehicleChange={setSelectedVehicle}
        onKilometersChange={setKilometers}
        onCustomerAdded={handleCustomerAdded}
        CustomerQuickAddComponent={CustomerQuickAdd}
      />

      <ServicesSection
        invoiceItems={invoiceItems}
        onAddService={addService}
        onAddPart={addPart}
        onRemoveItem={removeItem}
        onUpdateItemQuantity={updateItemQuantity}
        onUpdateItemDiscount={updateItemDiscount}
      />

      <PaymentSection
        laborCharges={laborCharges}
        extraCharges={extraCharges}
        discount={discount}
        taxRate={taxRate}
        notes={notes}
        paymentMethod={paymentMethod}
        paymentAmount={paymentAmount}
        onLaborChargesChange={setLaborCharges}
        onExtraChargesChange={setExtraCharges}
        onDiscountChange={setDiscount}
        onTaxRateChange={setTaxRate}
        onNotesChange={setNotes}
        onPaymentMethodChange={setPaymentMethod}
        onPaymentAmountChange={setPaymentAmount}
        subtotal={subtotal}
        total={total}
      />

      <InvoiceActionButtons
        onSaveDraft={handleSaveDraft}
        onCreateInvoice={handleCreateInvoice}
        onPrintPreview={handlePrintPreview}
        onCancel={onCancel}
        isLoading={createInvoiceMutation.isPending}
      />
    </div>
  );
};

export default NonGSTInvoiceForm;
