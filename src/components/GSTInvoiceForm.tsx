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
import GSTCustomerQuickAdd from "./GSTCustomerQuickAdd";
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

  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: services = [] } = useServices();
  const { data: parts = [] } = useParts();
  const createInvoiceMutation = useCreateInvoice();

  useEffect(() => {
    if (existingInvoice) {
      setSelectedCustomer(customers.find(c => c.id === existingInvoice.customerId) || null);
      setSelectedVehicle(vehicles.find(v => v.id === existingInvoice.vehicleId) || null);
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
    const customerVehicles = vehicles.filter(v => v.customer_id === customer.id);
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
      setShowPrintPreview(true); // Show print preview after creation
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
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="customer">Customer</Label>
              <Select 
                value={selectedCustomer?.id || ""} 
                onValueChange={(value) => {
                  const customer = customers.find(c => c.id === value);
                  setSelectedCustomer(customer || null);
                  setSelectedVehicle(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.filter(c => c.gst_number).map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.gst_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <GSTCustomerQuickAdd onCustomerAdded={handleCustomerAdded} />
          </div>

          {selectedCustomer && (
            <div>
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select 
                value={selectedVehicle?.id || ""} 
                onValueChange={(value) => {
                  const vehicle = vehicles.find(v => v.id === value && v.customer_id === selectedCustomer.id);
                  setSelectedVehicle(vehicle || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles
                    .filter(v => v.customer_id === selectedCustomer.id)
                    .map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} - {vehicle.vehicle_number}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="kilometers">Current Kilometers</Label>
            <Input
              id="kilometers"
              type="number"
              value={kilometers}
              onChange={(e) => setKilometers(Number(e.target.value))}
              placeholder="Enter current kilometers"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services and Parts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Parts</CardTitle>
          <CardDescription>Add services and parts for this invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={addService} variant="outline">Add Service</Button>
            <Button onClick={addPart} variant="outline">Add Part</Button>
          </div>

          {invoiceItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-6 gap-2 items-end p-4 border rounded">
              <div>
                <Label>Type</Label>
                <Select 
                  value={item.type} 
                  onValueChange={(value: 'service' | 'part') => {
                    setInvoiceItems(invoiceItems.map(i => 
                      i.id === item.id ? { ...i, type: value, itemId: '', name: '' } : i
                    ));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="part">Part</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Item</Label>
                <Select 
                  value={item.itemId} 
                  onValueChange={(value) => {
                    const selectedItem = item.type === 'service' 
                      ? services.find(s => s.id === value)
                      : parts.find(p => p.id === value);
                    
                    if (selectedItem) {
                      const unitPrice = item.type === 'service' 
                        ? (selectedItem as any).base_price || 0 
                        : (selectedItem as any).price || 0;
                      const total = item.quantity * unitPrice - item.discount;
                      setInvoiceItems(invoiceItems.map(i => 
                        i.id === item.id 
                          ? { ...i, itemId: value, name: selectedItem.name, unitPrice, total }
                          : i
                      ));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${item.type}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(item.type === 'service' ? services : parts).map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} - ₹{item.type === 'service' ? (option as any).base_price : (option as any).price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                  min="1"
                />
              </div>

              <div>
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => {
                    const unitPrice = Number(e.target.value);
                    const total = item.quantity * unitPrice - item.discount;
                    setInvoiceItems(invoiceItems.map(i => 
                      i.id === item.id ? { ...i, unitPrice, total } : i
                    ));
                  }}
                />
              </div>

              <div>
                <Label>Discount</Label>
                <Input
                  type="number"
                  value={item.discount}
                  onChange={(e) => updateItemDiscount(item.id, Number(e.target.value))}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label>Total</Label>
                  <div className="text-lg font-semibold">₹{item.total.toFixed(2)}</div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="labor-charges">Labor Charges</Label>
              <Input
                id="labor-charges"
                type="number"
                value={laborCharges}
                onChange={(e) => setLaborCharges(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                max="100"
              />
            </div>

            <div>
              <Label htmlFor="tax-rate">GST Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes for the invoice..."
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount ({discount}%):</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>CGST ({(taxRate / 2).toFixed(1)}%):</span>
              <span>₹{(taxAmount / 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST ({(taxRate / 2).toFixed(1)}%):</span>
              <span>₹{(taxAmount / 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
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
