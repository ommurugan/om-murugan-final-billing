import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Invoice } from "@/types/billing";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useCreateInvoice } from "@/hooks/useInvoices";
import CustomerSection from "./invoice/CustomerSection";
import ServicesSection from "./invoice/ServicesSection";
import PaymentSection from "./invoice/PaymentSection";

interface NonGSTInvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const NonGSTInvoiceForm = ({ onSave, onCancel, existingInvoice }: NonGSTInvoiceFormProps) => {
  const { data: customers = [] } = useCustomers();
  const { data: dbVehicles = [] } = useVehicles();
  const { data: services = [] } = useServices();
  const { data: parts = [] } = useParts();
  const createInvoiceMutation = useCreateInvoice();

  // Transform database vehicles to match TypeScript interface
  const vehicles = dbVehicles.map(v => ({
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

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [kilometers, setKilometers] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<any>([]);
  const [laborCharges, setLaborCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'netbanking'>("cash");
  const [notes, setNotes] = useState("");

  // Load existing invoice data if editing
  useEffect(() => {
    if (existingInvoice) {
      const customer = customers.find(c => c.id === existingInvoice.customerId);
      const vehicle = vehicles.find(v => v.id === existingInvoice.vehicleId);
      
      setSelectedCustomer(customer || null);
      setSelectedVehicle(vehicle || null);
      setKilometers(existingInvoice.kilometers || 0);
      setInvoiceItems(existingInvoice.items || []);
      setLaborCharges(existingInvoice.laborCharges || 0);
      setDiscount(existingInvoice.discount || 0);
      setTaxRate(existingInvoice.taxRate || 0);
      setNotes(existingInvoice.notes || "");
    }
  }, [existingInvoice, customers, vehicles]);

  const handleCustomerAdded = (newCustomer) => {
    const addedCustomer = customers.find(c => c.createdAt === newCustomer.createdAt);
    if (addedCustomer) {
      setSelectedCustomer(addedCustomer);
    }
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0) + laborCharges;
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const addService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      console.log("Adding service with HSN code:", service.hsn_code);
      const newItem = {
        id: `service-${Date.now()}`,
        type: 'service' as const,
        itemId: serviceId,
        name: service.name,
        quantity: 1,
        unitPrice: (service as any).base_price || 0,
        discount: 0,
        total: (service as any).base_price || 0,
        hsnCode: service.hsn_code, // Use actual HSN code from service
        hsn_code: service.hsn_code // Also set hsn_code for compatibility
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }
  };

  const addPart = (partId: string) => {
    const part = parts.find(p => p.id === partId);
    if (part) {
      console.log("Adding part with HSN code:", part.hsn_code);
      const newItem = {
        id: `part-${Date.now()}`,
        type: 'part' as const,
        itemId: partId,
        name: part.name,
        quantity: 1,
        unitPrice: (part as any).price || 0,
        discount: 0,
        total: (part as any).price || 0,
        hsnCode: part.hsn_code, // Use actual HSN code from part
        hsn_code: part.hsn_code // Also set hsn_code for compatibility
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }
  };

  const removeItem = (id) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const newTotal = (item.unitPrice * quantity) - item.discount;
        return { ...item, quantity, total: newTotal };
      }
      return item;
    }));
  };

  const updateDiscount = (id, discount) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const newTotal = (item.unitPrice * item.quantity) - discount;
        return { ...item, discount, total: newTotal };
      }
      return item;
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedVehicle) {
      toast.error("Please select customer and vehicle");
      return;
    }

    if (invoiceItems.length === 0) {
      toast.error("Please add at least one service or part");
      return;
    }

    const invoiceData = {
      invoiceNumber: existingInvoice?.invoiceNumber || `NON-GST-${Date.now()}`,
      invoiceType: 'non-gst' as const,
      customerId: selectedCustomer.id,
      vehicleId: selectedVehicle.id,
      items: invoiceItems,
      subtotal,
      discount: discountAmount,
      taxRate,
      taxAmount,
      extraCharges: [],
      total,
      status: 'pending' as const,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes,
      laborCharges,
      payments: [],
      kilometers
    };

    try {
      if (existingInvoice) {
        onSave({ 
          ...invoiceData, 
          id: existingInvoice.id, 
          createdAt: existingInvoice.createdAt 
        });
      } else {
        const result = await createInvoiceMutation.mutateAsync(invoiceData);
        onSave({ 
          ...invoiceData, 
          id: result.id, 
          createdAt: result.created_at 
        });
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer & Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerSection
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

      <ServicesSection
        invoiceItems={invoiceItems}
        onAddService={addService}
        onAddPart={addPart}
        onRemoveItem={removeItem}
        onUpdateItemQuantity={updateQuantity}
        onUpdateItemDiscount={updateDiscount}
      />

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentSection
            laborCharges={laborCharges}
            extraCharges={[]}
            discount={discount}
            taxRate={taxRate}
            paymentMethod={paymentMethod}
            paymentAmount={total}
            notes={notes}
            onLaborChargesChange={setLaborCharges}
            onExtraChargesChange={() => {}}
            onDiscountChange={setDiscount}
            onTaxRateChange={setTaxRate}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentAmountChange={() => {}}
            onNotesChange={setNotes}
            subtotal={subtotal}
            total={total}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={createInvoiceMutation.isPending}>
          {createInvoiceMutation.isPending ? "Saving..." : existingInvoice ? "Update Invoice" : "Save Invoice"}
        </Button>
      </div>
    </div>
  );
};

export default NonGSTInvoiceForm;
