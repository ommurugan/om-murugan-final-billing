import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Customer, Vehicle, Service, Part, Invoice, InvoiceItem, Payment } from "@/types/billing";
import InvoicePrintPreview from "../InvoicePrintPreview";
import CustomerQuickAdd from "../CustomerQuickAdd";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";
import CustomerVehicleSelection from "./CustomerVehicleSelection";
import ServicesPartsSelection from "./ServicesPartsSelection";
import AdditionalCharges from "./AdditionalCharges";
import PaymentSummary from "./PaymentSummary";
import InvoiceActionButtons from "./InvoiceActionButtons";

interface InvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const InvoiceForm = ({ onSave, onCancel, existingInvoice }: InvoiceFormProps) => {
  const { data: customersData = [] } = useCustomers();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [kilometers, setKilometers] = useState(0);

  // Fetch vehicles for the selected customer
  const { data: vehiclesData = [] } = useVehicles(selectedCustomer?.id);
  
  // Fetch services and parts
  const { data: servicesData = [] } = useServices();
  const { data: partsData = [] } = useParts();

  console.log("Services data:", servicesData);
  console.log("Parts data:", partsData);
  console.log("Vehicles data:", vehiclesData);
  console.log("Selected customer:", selectedCustomer);

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [laborCharges, setLaborCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18);
  const [extraCharges, setExtraCharges] = useState<Array<{name: string; amount: number}>>([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Update customers when data changes
  useEffect(() => {
    setCustomers(customersData);
  }, [customersData]);

  // Transform database vehicles to match our interface
  const transformedVehicles: Vehicle[] = vehiclesData.map(v => ({
    id: v.id,
    customerId: v.customer_id,
    make: v.make,
    model: v.model,
    year: v.year,
    vehicleNumber: v.vehicle_number,
    vehicleType: (v.vehicle_type as 'car' | 'bike' | 'scooter') || 'car',
    engineNumber: v.engine_number,
    chassisNumber: v.chassis_number,
    color: v.color,
    createdAt: v.created_at
  }));

  // Transform database services to match our interface
  const transformedServices: Service[] = servicesData.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    basePrice: Number(s.base_price),
    estimatedTime: s.estimated_time,
    description: s.description,
    isActive: s.is_active
  }));

  // Transform database parts to match our interface
  const transformedParts: Part[] = partsData.map(p => ({
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

  // Use invoice calculations hook
  const { subtotal, total } = useInvoiceCalculations({
    invoiceItems,
    laborCharges,
    extraCharges,
    discount,
    taxRate
  });

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    setSelectedCustomer(newCustomer);
  };

  // Service and part handlers
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

  const handleSaveInvoice = (status: Invoice['status'] = 'draft') => {
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part");
      return;
    }

    const invoice = createInvoiceObject(status);
    onSave(invoice);
    toast.success(`Invoice ${status === 'draft' ? 'saved as draft' : 'created'} successfully!`);
  };

  const handlePrintPreview = () => {
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part to preview");
      return;
    }
    setShowPrintPreview(true);
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
      <CustomerVehicleSelection
        customers={customers}
        selectedCustomer={selectedCustomer}
        selectedVehicle={selectedVehicle}
        vehicles={transformedVehicles}
        kilometers={kilometers}
        onCustomerChange={setSelectedCustomer}
        onVehicleChange={setSelectedVehicle}
        onKilometersChange={setKilometers}
        onCustomerAdded={handleCustomerAdded}
        CustomerQuickAddComponent={CustomerQuickAdd}
      />

      <ServicesPartsSelection
        services={transformedServices}
        parts={transformedParts}
        invoiceItems={invoiceItems}
        onAddService={addService}
        onAddPart={addPart}
        onRemoveItem={removeItem}
        onUpdateItemQuantity={updateItemQuantity}
        onUpdateItemDiscount={updateItemDiscount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdditionalCharges
          laborCharges={laborCharges}
          extraCharges={extraCharges}
          discount={discount}
          taxRate={taxRate}
          notes={notes}
          onLaborChargesChange={setLaborCharges}
          onExtraChargesChange={setExtraCharges}
          onDiscountChange={setDiscount}
          onTaxRateChange={setTaxRate}
          onNotesChange={setNotes}
        />

        <PaymentSummary
          subtotal={subtotal}
          discount={discount}
          taxRate={taxRate}
          total={total}
          paymentMethod={paymentMethod}
          paymentAmount={paymentAmount}
          onPaymentMethodChange={setPaymentMethod}
          onPaymentAmountChange={setPaymentAmount}
        />
      </div>

      <InvoiceActionButtons
        onSaveDraft={() => handleSaveInvoice('draft')}
        onCreateInvoice={() => handleSaveInvoice('sent')}
        onPrintPreview={handlePrintPreview}
        onCancel={onCancel}
      />
    </div>
  );
};

export default InvoiceForm;
