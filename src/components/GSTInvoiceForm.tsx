import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2,
  Car,
  User,
  Receipt,
  CreditCard,
  Printer,
  Mail,
  Save,
  Gauge,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { Customer, Vehicle, Service, Part, Invoice, InvoiceItem, Payment } from "@/types/billing";
import InvoicePrintPreview from "./InvoicePrintPreview";
import GSTCustomerQuickAdd from "./GSTCustomerQuickAdd";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";

interface GSTInvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const GSTInvoiceForm = ({ onSave, onCancel, existingInvoice }: GSTInvoiceFormProps) => {
  const { data: customersData = [] } = useCustomers();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [kilometers, setKilometers] = useState<number>(0);

  // Fetch vehicles for the selected customer
  const { data: vehiclesData = [] } = useVehicles(selectedCustomer?.id);
  
  // Fetch services and parts
  const { data: servicesData = [] } = useServices();
  const { data: partsData = [] } = useParts();

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [laborCharges, setLaborCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18); // Default GST rate
  const [extraCharges, setExtraCharges] = useState<Array<{name: string; amount: number}>>([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Update customers and filter GST customers when data changes
  useEffect(() => {
    const gstCustomers = customersData.filter(customer => customer.gstNumber && customer.gstNumber.trim() !== '');
    setCustomers(gstCustomers);
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

  const customerVehicles = selectedCustomer ? transformedVehicles.filter(v => v.customerId === selectedCustomer.id) : [];

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    setSelectedCustomer(newCustomer);
  };

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

  const addExtraCharge = () => {
    setExtraCharges([...extraCharges, { name: "", amount: 0 }]);
  };

  const updateExtraCharge = (index: number, field: 'name' | 'amount', value: string | number) => {
    const updated = [...extraCharges];
    updated[index] = { ...updated[index], [field]: value };
    setExtraCharges(updated);
  };

  const removeExtraCharge = (index: number) => {
    setExtraCharges(extraCharges.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    const itemsTotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const extraTotal = extraCharges.reduce((sum, charge) => sum + charge.amount, 0);
    return itemsTotal + laborCharges + extraTotal;
  };

  const calculateGSTAmounts = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const totalGSTAmount = (afterDiscount * taxRate) / 100;
    const sgstAmount = totalGSTAmount / 2;
    const cgstAmount = totalGSTAmount / 2;
    
    return {
      subtotal,
      discountAmount,
      afterDiscount,
      sgstAmount,
      cgstAmount,
      totalGSTAmount,
      total: afterDiscount + totalGSTAmount
    };
  };

  const { subtotal, discountAmount, afterDiscount, sgstAmount, cgstAmount, totalGSTAmount, total } = calculateGSTAmounts();

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `GST-INV-${year}${month}${day}-${random}`;
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
      invoiceType: 'gst' as const,
      customerId: selectedCustomer!.id,
      vehicleId: selectedVehicle!.id,
      items: invoiceItems,
      subtotal,
      discount,
      taxRate,
      taxAmount: totalGSTAmount,
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

  const validateForm = () => {
    if (!selectedCustomer) {
      toast.error("Please select a GST customer");
      return false;
    }
    
    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return false;
    }
    
    if (invoiceItems.length === 0) {
      toast.error("Please add at least one service or part");
      return false;
    }

    if (!selectedCustomer.gstNumber) {
      toast.error("GST number is required for GST invoice");
      return false;
    }

    return true;
  };

  const handleSaveDraft = () => {
    if (!validateForm()) return;

    const invoice = createInvoiceObject('draft');
    onSave(invoice);
    toast.success("GST Draft saved successfully!");
  };

  const handleCreateInvoice = () => {
    if (!validateForm()) return;

    const invoice = createInvoiceObject('pending');
    onSave(invoice);
    toast.success("GST Invoice created successfully!");
  };

  const handlePrintPreview = () => {
    if (!validateForm()) return;
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
      {/* Customer & Vehicle Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              GST Customer Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Select GST Customer</Label>
                <GSTCustomerQuickAdd onCustomerAdded={handleCustomerAdded} />
              </div>
              <Select onValueChange={(value) => {
                const customer = customers.find(c => c.id === value);
                setSelectedCustomer(customer || null);
                setSelectedVehicle(null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a GST customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.length === 0 ? (
                    <SelectItem value="no-customers" disabled>
                      No GST customers found
                    </SelectItem>
                  ) : (
                    customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedCustomer && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    GST: {selectedCustomer.gstNumber}
                  </span>
                </div>
                <Badge variant="secondary">
                  Total Spent: ₹{selectedCustomer.totalSpent.toLocaleString()}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Selection & Kilometers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Vehicle</Label>
              <Select 
                onValueChange={(value) => {
                  const vehicle = transformedVehicles.find(v => v.id === value);
                  setSelectedVehicle(vehicle || null);
                }}
                disabled={!selectedCustomer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {transformedVehicles.length === 0 ? (
                    <SelectItem value="no-vehicles" disabled>
                      No vehicles found for this customer
                    </SelectItem>
                  ) : (
                    transformedVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} - {vehicle.vehicleNumber}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedVehicle && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</p>
                <p className="text-sm text-gray-600">{selectedVehicle.vehicleNumber}</p>
                <Badge variant="secondary">{selectedVehicle.vehicleType}</Badge>
              </div>
            )}
            
            <div>
              <Label className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Current Kilometers
              </Label>
              <Input
                type="number"
                value={kilometers}
                onChange={(e) => setKilometers(parseInt(e.target.value) || 0)}
                placeholder="Enter current kilometers"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Record the vehicle's current kilometer reading
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services & Parts */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Parts</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="services" className="space-y-4">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              <TabsTrigger value="selected">Selected Items ({invoiceItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              {transformedServices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No services available. Please add services first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transformedServices.map(service => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.category}</p>
                          <p className="text-lg font-semibold text-blue-600">₹{service.basePrice}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addService(service.id)}
                          disabled={invoiceItems.some(item => item.itemId === service.id && item.type === 'service')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="parts" className="space-y-4">
              {transformedParts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No parts available. Please add parts first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transformedParts.map(part => (
                    <div key={part.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{part.name}</h4>
                          <p className="text-sm text-gray-600">{part.category}</p>
                          <p className="text-lg font-semibold text-green-600">₹{part.price}</p>
                          <p className="text-xs text-gray-500">Stock: {part.stockQuantity}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addPart(part.id)}
                          disabled={invoiceItems.some(item => item.itemId === part.id && item.type === 'part')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="selected" className="space-y-4">
              {invoiceItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items selected</p>
              ) : (
                <div className="space-y-3">
                  {invoiceItems.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min="1"
                            />
                            <p className="text-xs text-gray-500">Qty</p>
                          </div>
                          <div className="text-right">
                            <Input
                              type="number"
                              value={item.discount}
                              onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                              className="w-20 text-center"
                              min="0"
                            />
                            <p className="text-xs text-gray-500">Discount</p>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <p className="font-semibold">₹{item.total}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Charges with GST Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Additional Charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Labor Charges</Label>
              <Input
                type="number"
                value={laborCharges}
                onChange={(e) => setLaborCharges(parseFloat(e.target.value) || 0)}
                placeholder="Enter labor charges"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Extra Charges</Label>
                <Button size="sm" variant="outline" onClick={addExtraCharge}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {extraCharges.map((charge, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Charge name"
                    value={charge.name}
                    onChange={(e) => updateExtraCharge(index, 'name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={charge.amount}
                    onChange={(e) => updateExtraCharge(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-32"
                  />
                  <Button size="sm" variant="ghost" onClick={() => removeExtraCharge(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label>GST Rate (%)</Label>
                <Select value={taxRate.toString()} onValueChange={(value) => setTaxRate(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment & Invoice Summary with SGST/CGST */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment & Summary (GST)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>SGST ({taxRate/2}%):</span>
                <span>₹{sgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>CGST ({taxRate/2}%):</span>
                <span>₹{cgstAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Details
              </h4>
              
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: Payment['method']) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment Amount</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  max={total}
                />
                {paymentAmount < total && (
                  <p className="text-sm text-orange-600 mt-1">
                    Partial payment: ₹{(total - paymentAmount).toFixed(2)} remaining
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveDraft} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
              <Receipt className="h-4 w-4 mr-2" />
              Create GST Invoice
            </Button>
            <Button onClick={handlePrintPreview} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Preview
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Invoice
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GSTInvoiceForm;
