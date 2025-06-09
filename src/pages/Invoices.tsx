
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Mail, 
  Eye,
  Edit,
  Trash2,
  Car,
  User
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

const Invoices = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);

  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicleModel: "",
    vehicleNumber: "",
    vehicleType: "",
    serviceType: "",
    laborCharges: 0,
    discount: 0,
    taxRate: 18,
    notes: ""
  });

  const services = [
    { id: 1, name: "Full Service", price: 2500 },
    { id: 2, name: "Oil Change", price: 800 },
    { id: 3, name: "Brake Service", price: 1200 },
    { id: 4, name: "Engine Repair", price: 3500 },
    { id: 5, name: "Tire Rotation", price: 500 },
    { id: 6, name: "Battery Check", price: 300 }
  ];

  const parts = [
    { id: 1, name: "Engine Oil", price: 450 },
    { id: 2, name: "Brake Pads", price: 800 },
    { id: 3, name: "Air Filter", price: 350 },
    { id: 4, name: "Spark Plugs", price: 200 },
    { id: 5, name: "Chain & Sprocket", price: 1200 },
    { id: 6, name: "Clutch Plates", price: 900 }
  ];

  const existingInvoices = [
    { 
      id: "INV-001", 
      customer: "Rajesh Kumar", 
      vehicle: "Honda City", 
      amount: 2500, 
      status: "Paid", 
      date: "2024-01-15" 
    },
    { 
      id: "INV-002", 
      customer: "Priya Sharma", 
      vehicle: "Yamaha R15", 
      amount: 800, 
      status: "Pending", 
      date: "2024-01-14" 
    },
    { 
      id: "INV-003", 
      customer: "Anand Patel", 
      vehicle: "Maruti Swift", 
      amount: 1200, 
      status: "Overdue", 
      date: "2024-01-13" 
    }
  ];

  const calculateSubtotal = () => {
    const serviceTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    const partsTotal = selectedParts.reduce((sum, part) => sum + part.price, 0);
    return serviceTotal + partsTotal + invoiceData.laborCharges;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * invoiceData.discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * invoiceData.taxRate) / 100;
    return afterDiscount + taxAmount;
  };

  const handleCreateInvoice = () => {
    if (!invoiceData.customerName || !invoiceData.vehicleModel) {
      toast.error("Please fill in customer and vehicle details");
      return;
    }
    
    toast.success("Invoice created successfully!");
    setShowCreateForm(false);
    setInvoiceData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      vehicleModel: "",
      vehicleNumber: "",
      vehicleType: "",
      serviceType: "",
      laborCharges: 0,
      discount: 0,
      taxRate: 18,
      notes: ""
    });
    setSelectedServices([]);
    setSelectedParts([]);
  };

  const addService = (serviceId) => {
    const service = services.find(s => s.id === parseInt(serviceId));
    if (service && !selectedServices.find(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addPart = (partId) => {
    const part = parts.find(p => p.id === parseInt(partId));
    if (part && !selectedParts.find(p => p.id === part.id)) {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const removeService = (serviceId) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  const removePart = (partId) => {
    setSelectedParts(selectedParts.filter(p => p.id !== partId));
  };

  if (showCreateForm) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">Customer Name *</Label>
                        <Input 
                          id="customerName"
                          value={invoiceData.customerName}
                          onChange={(e) => setInvoiceData({...invoiceData, customerName: e.target.value})}
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <Input 
                          id="customerPhone"
                          value={invoiceData.customerPhone}
                          onChange={(e) => setInvoiceData({...invoiceData, customerPhone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email Address</Label>
                      <Input 
                        id="customerEmail"
                        type="email"
                        value={invoiceData.customerEmail}
                        onChange={(e) => setInvoiceData({...invoiceData, customerEmail: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                        <Input 
                          id="vehicleModel"
                          value={invoiceData.vehicleModel}
                          onChange={(e) => setInvoiceData({...invoiceData, vehicleModel: e.target.value})}
                          placeholder="e.g., Honda City, Yamaha R15"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                        <Input 
                          id="vehicleNumber"
                          value={invoiceData.vehicleNumber}
                          onChange={(e) => setInvoiceData({...invoiceData, vehicleNumber: e.target.value})}
                          placeholder="e.g., TN 01 AB 1234"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="vehicleType">Vehicle Type</Label>
                      <Select onValueChange={(value) => setInvoiceData({...invoiceData, vehicleType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="bike">Bike/Motorcycle</SelectItem>
                          <SelectItem value="scooter">Scooter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Services & Parts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Services & Parts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Services */}
                    <div>
                      <Label>Add Services</Label>
                      <Select onValueChange={addService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map(service => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name} - ₹{service.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedServices.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {selectedServices.map(service => (
                            <div key={service.id} className="flex justify-between items-center bg-blue-50 p-2 rounded">
                              <span>{service.name}</span>
                              <div className="flex items-center gap-2">
                                <span>₹{service.price}</span>
                                <Button size="sm" variant="ghost" onClick={() => removeService(service.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Parts */}
                    <div>
                      <Label>Add Parts</Label>
                      <Select onValueChange={addPart}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parts to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {parts.map(part => (
                            <SelectItem key={part.id} value={part.id.toString()}>
                              {part.name} - ₹{part.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedParts.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {selectedParts.map(part => (
                            <div key={part.id} className="flex justify-between items-center bg-green-50 p-2 rounded">
                              <span>{part.name}</span>
                              <div className="flex items-center gap-2">
                                <span>₹{part.price}</span>
                                <Button size="sm" variant="ghost" onClick={() => removePart(part.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Labor Charges */}
                    <div>
                      <Label htmlFor="laborCharges">Labor Charges</Label>
                      <Input 
                        id="laborCharges"
                        type="number"
                        value={invoiceData.laborCharges}
                        onChange={(e) => setInvoiceData({...invoiceData, laborCharges: parseFloat(e.target.value) || 0})}
                        placeholder="Enter labor charges"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input 
                          id="discount"
                          type="number"
                          value={invoiceData.discount}
                          onChange={(e) => setInvoiceData({...invoiceData, discount: parseFloat(e.target.value) || 0})}
                          placeholder="Enter discount percentage"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxRate">Tax Rate (%)</Label>
                        <Input 
                          id="taxRate"
                          type="number"
                          value={invoiceData.taxRate}
                          onChange={(e) => setInvoiceData({...invoiceData, taxRate: parseFloat(e.target.value) || 0})}
                          placeholder="Enter tax rate"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        id="notes"
                        value={invoiceData.notes}
                        onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                        placeholder="Additional notes or comments"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Invoice Preview */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Invoice Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center border-b pb-4">
                      <h3 className="font-bold text-lg">OM MURUGAN AUTO WORKS</h3>
                      <p className="text-sm text-gray-600">Professional Auto Service</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div><strong>Customer:</strong> {invoiceData.customerName || "N/A"}</div>
                      <div><strong>Vehicle:</strong> {invoiceData.vehicleModel || "N/A"}</div>
                      <div><strong>Number:</strong> {invoiceData.vehicleNumber || "N/A"}</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Services:</h4>
                      {selectedServices.map(service => (
                        <div key={service.id} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>₹{service.price}</span>
                        </div>
                      ))}
                      
                      {selectedParts.length > 0 && (
                        <>
                          <h4 className="font-semibold mt-4">Parts:</h4>
                          {selectedParts.map(part => (
                            <div key={part.id} className="flex justify-between text-sm">
                              <span>{part.name}</span>
                              <span>₹{part.price}</span>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {invoiceData.laborCharges > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Labor Charges</span>
                          <span>₹{invoiceData.laborCharges}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{calculateSubtotal()}</span>
                      </div>
                      {invoiceData.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({invoiceData.discount}%):</span>
                          <span>-₹{((calculateSubtotal() * invoiceData.discount) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax ({invoiceData.taxRate}%):</span>
                        <span>₹{(((calculateSubtotal() - (calculateSubtotal() * invoiceData.discount) / 100) * invoiceData.taxRate) / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button onClick={handleCreateInvoice} className="w-full bg-blue-600 hover:bg-blue-700">
                      Create Invoice
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search invoices by customer name or invoice ID..." 
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Manage and track all your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.id}</p>
                        <p className="text-sm text-gray-600">{invoice.customer} • {invoice.vehicle}</p>
                        <p className="text-xs text-gray-500">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{invoice.amount}</p>
                        <Badge 
                          variant={
                            invoice.status === 'Paid' ? 'default' : 
                            invoice.status === 'Pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
