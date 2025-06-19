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
import GSTCustomerSelection from "./gst-invoice/GSTCustomerSelection";
import GSTServicesPartsSection from "./gst-invoice/GSTServicesPartsSection";
import GSTPaymentSection from "./gst-invoice/GSTPaymentSection";

interface GSTInvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const GSTInvoiceForm = ({ onSave, onCancel, existingInvoice }: GSTInvoiceFormProps) => {
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

  // Filter customers to only show those with GST numbers - customers are already transformed by useCustomers hook
  const gstCustomers = customers.filter(customer => customer.gstNumber);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [kilometers, setKilometers] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<any>([]);
  const [laborCharges, setLaborCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  // Load existing invoice data if editing
  useEffect(() => {
    if (existingInvoice) {
      const customer = gstCustomers.find(c => c.id === existingInvoice.customerId);
      const vehicle = vehicles.find(v => v.id === existingInvoice.vehicleId);
      
      setSelectedCustomer(customer || null);
      setSelectedVehicle(vehicle || null);
      setKilometers(existingInvoice.kilometers || 0);
      setInvoiceItems(existingInvoice.items || []);
      setLaborCharges(existingInvoice.laborCharges || 0);
      setDiscount(existingInvoice.discount || 0);
      setTaxRate(existingInvoice.taxRate || 18);
      setNotes(existingInvoice.notes || "");
    }
  }, [existingInvoice, gstCustomers, vehicles]);

  const handleCustomerAdded = (newCustomer) => {
    // Find the newly added customer with GST
    const addedCustomer = gstCustomers.find(c => c.gstNumber && c.createdAt === newCustomer.createdAt);
    if (addedCustomer) {
      setSelectedCustomer(addedCustomer);
    }
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0) + laborCharges;
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const addService = () => {
    const newItem = {
      id: `service-${Date.now()}`,
      type: 'service',
      itemId: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const addPart = () => {
    const newItem = {
      id: `part-${Date.now()}`,
      type: 'part',
      itemId: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
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

  const handleItemSelect = (itemId, value) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === itemId) {
        const selectedItem = item.type === 'service' 
          ? services.find(s => s.id === value)
          : parts.find(p => p.id === value);
        
        if (selectedItem) {
          // Handle property name differences between database and interface
          const unitPrice = item.type === 'service' 
            ? (selectedItem as any).base_price 
            : (selectedItem as any).price;
          const newTotal = (unitPrice * item.quantity) - item.discount;
          return {
            ...item,
            itemId: value,
            name: selectedItem.name,
            unitPrice,
            total: newTotal
          };
        }
      }
      return item;
    }));
  };

  const handleUnitPriceChange = (itemId, price) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === itemId) {
        const newTotal = (price * item.quantity) - item.discount;
        return { ...item, unitPrice: price, total: newTotal };
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
      invoiceNumber: existingInvoice?.invoiceNumber || `GST-${Date.now()}`,
      invoiceType: 'gst' as const,
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
          <GSTCustomerSelection
            customers={gstCustomers}
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

      <Card>
        <CardHeader>
          <CardTitle>Services & Parts</CardTitle>
        </CardHeader>
        <CardContent>
          <GSTServicesPartsSection
            invoiceItems={invoiceItems}
            services={services}
            parts={parts}
            onAddService={addService}
            onAddPart={addPart}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateQuantity}
            onUpdateDiscount={updateDiscount}
            onItemSelect={handleItemSelect}
            onUnitPriceChange={handleUnitPriceChange}
          />
        </CardContent>
      </Card>

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

export default GSTInvoiceForm;
