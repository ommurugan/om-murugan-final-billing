import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Invoice, Customer, Vehicle } from "@/types/billing";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useCreateInvoice } from "@/hooks/useCreateInvoice";
import GSTCustomerSelection from "./gst-invoice/GSTCustomerSelection";
import GSTServicesPartsSection from "./gst-invoice/GSTServicesPartsSection";
import GSTPaymentSection from "./gst-invoice/GSTPaymentSection";
import InvoiceActionButtons from "./invoice/InvoiceActionButtons";
import ProfessionalInvoicePrint from "./ProfessionalInvoicePrint";

interface GSTInvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const GSTInvoiceForm = ({ onSave, onCancel, existingInvoice }: GSTInvoiceFormProps) => {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [kilometers, setKilometers] = useState<number>(0);
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [laborCharges, setLaborCharges] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [extraCharges, setExtraCharges] = useState<{ name: string; amount: number }[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const { data: customersData = [] } = useCustomers();
  const { data: vehiclesData = [] } = useVehicles();
  const { data: services = [] } = useServices();
  const { data: parts = [] } = useParts();
  const createInvoiceMutation = useCreateInvoice();

  // Transform database customers to match our interface
  const customers: Customer[] = customersData.map(c => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    gstNumber: c.gst_number,
    createdAt: c.created_at,
    totalSpent: 0,
    loyaltyPoints: 0,
    notes: c.notes
  }));

  // Transform database vehicles to match our interface
  const vehicles: Vehicle[] = vehiclesData.map(v => ({
    id: v.id,
    customerId: v.customer_id,
    make: v.make,
    model: v.model,
    year: v.year,
    vehicleNumber: v.vehicle_number,
    vehicleType: v.vehicle_type as 'car' | 'bike' | 'scooter',
    engineNumber: v.engine_number,
    chassisNumber: v.chassis_number,
    color: v.color,
    createdAt: v.created_at
  }));

  useEffect(() => {
    if (existingInvoice) {
      const customer = customers.find(c => c.id === existingInvoice.customerId);
      const vehicle = vehicles.find(v => v.id === existingInvoice.vehicleId);
      
      if (customer) setSelectedCustomer(customer);
      if (vehicle) setSelectedVehicle(vehicle);
      
      setKilometers(existingInvoice.kilometers || 0);
      setInvoiceItems(existingInvoice.items || []);
      setLaborCharges(existingInvoice.laborCharges || 0);
      setDiscount(existingInvoice.discount || 0);
      setTaxRate(existingInvoice.taxRate || 18);
      setExtraCharges(existingInvoice.extraCharges || []);
      setNotes(existingInvoice.notes || "");
      setPaymentMethod("cash");
      setPaymentAmount(0);
    }
  }, [existingInvoice, customers, vehicles]);

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0) + laborCharges + extraCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const generateInvoiceNumber = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000);
    return `GST-INV-${dateStr}-${randomNum}`;
  };

  const createInvoiceObject = (status: Invoice['status']): Invoice => {
    return {
      id: existingInvoice?.id || crypto.randomUUID(),
      invoiceNumber: existingInvoice?.invoiceNumber || generateInvoiceNumber(),
      invoiceType: 'gst',
      customerId: selectedCustomer!.id,
      vehicleId: selectedVehicle!.id,
      items: invoiceItems,
      subtotal,
      discount,
      taxRate,
      taxAmount,
      extraCharges,
      total,
      status,
      createdAt: existingInvoice?.createdAt || new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      laborCharges,
      payments: existingInvoice?.payments || [],
      kilometers,
      notes
    };
  };

  const handleCustomerAdded = (customer: Customer) => {
    setSelectedCustomer(customer);
    // Find vehicles for this customer
    const customerVehicles = vehicles.filter(v => v.customerId === customer.id);
    if (customerVehicles.length > 0) {
      setSelectedVehicle(customerVehicles[0]);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedCustomer || !selectedVehicle) {
      toast.error("Please select customer and vehicle before saving draft");
      return;
    }

    try {
      const invoice = createInvoiceObject('draft');
      await createInvoiceMutation.mutateAsync(invoice);
      onSave(invoice);
      toast.success("GST Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  };

  const handleCreateInvoice = async () => {
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part");
      return;
    }

    try {
      const invoice = createInvoiceObject('pending');
      await createInvoiceMutation.mutateAsync(invoice);
      onSave(invoice);
      setShowPrintPreview(true);
      toast.success("GST Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  const handlePrintPreview = () => {
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part to preview");
      return;
    }
    setShowPrintPreview(true);
  };

  const addService = () => {
    const newService = {
      id: crypto.randomUUID(),
      type: 'service' as const,
      itemId: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newService]);
  };

  const addPart = () => {
    const newPart = {
      id: crypto.randomUUID(),
      type: 'part' as const,
      itemId: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newPart]);
  };

  const removeItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const total = quantity * item.unitPrice - item.discount;
        return { ...item, quantity, total };
      }
      return item;
    }));
  };

  const updateItemDiscount = (id: string, discount: number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const total = item.quantity * item.unitPrice - discount;
        return { ...item, discount, total };
      }
      return item;
    }));
  };

  const handleItemSelect = (itemId: string, value: string) => {
    const item = invoiceItems.find(i => i.id === itemId);
    if (!item) return;

    const selectedItem = item.type === 'service' 
      ? services.find(s => s.id === value)
      : parts.find(p => p.id === value);
    
    if (selectedItem) {
      const unitPrice = item.type === 'service' 
        ? (selectedItem as any).base_price || 0 
        : (selectedItem as any).price || 0;
      const total = item.quantity * unitPrice - item.discount;
      setInvoiceItems(invoiceItems.map(i => 
        i.id === itemId 
          ? { ...i, itemId: value, name: selectedItem.name, unitPrice, total }
          : i
      ));
    }
  };

  const handleUnitPriceChange = (itemId: string, unitPrice: number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === itemId) {
        const total = item.quantity * unitPrice - item.discount;
        return { ...item, unitPrice, total };
      }
      return item;
    }));
  };

  if (showPrintPreview && selectedCustomer && selectedVehicle) {
    const previewInvoice = createInvoiceObject('draft');
    return (
      <ProfessionalInvoicePrint
        invoice={previewInvoice}
        customer={selectedCustomer}
        vehicle={selectedVehicle}
        onClose={() => setShowPrintPreview(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer & Vehicle Details</CardTitle>
          <CardDescription>Select customer and vehicle for this GST invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <GSTCustomerSelection
            customers={customers}
            vehicles={vehicles}
            selectedCustomer={selectedCustomer}
            selectedVehicle={selectedVehicle}
            kilometers={kilometers}
            onCustomerChange={setSelectedCustomer}
            onVehicleChange={setSelectedVehicle}
            onKilometersChange={setKilometers}
            onCustomerAdded={handleCustomerAdded}
          />
        </CardContent>
      </Card>

      {/* Services and Parts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Parts</CardTitle>
          <CardDescription>Add services and parts for this invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <GSTServicesPartsSection
            invoiceItems={invoiceItems}
            services={services}
            parts={parts}
            onAddService={addService}
            onAddPart={addPart}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateItemQuantity}
            onUpdateDiscount={updateItemDiscount}
            onItemSelect={handleItemSelect}
            onUnitPriceChange={handleUnitPriceChange}
          />
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <GSTPaymentSection
            laborCharges={laborCharges}
            discount={discount}
            taxRate={taxRate}
            paymentMethod={paymentMethod}
            notes={notes}
            subtotal={subtotal}
            discountAmount={discountAmount}
            taxAmount={taxAmount}
            total={total}
            onLaborChargesChange={setLaborCharges}
            onDiscountChange={setDiscount}
            onTaxRateChange={setTaxRate}
            onPaymentMethodChange={setPaymentMethod}
            onNotesChange={setNotes}
          />
        </CardContent>
      </Card>

      <InvoiceActionButtons
        onSaveDraft={handleSaveDraft}
        onCreateInvoice={handleCreateInvoice}
        onPrintPreview={handlePrintPreview}
        onCancel={onCancel}
        isLoading={createInvoiceMutation.isPending}
        showSaveDraft={true}
      />
    </div>
  );
};

export default GSTInvoiceForm;
