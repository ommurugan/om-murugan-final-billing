import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Mail, 
  Eye,
  Edit,
  Trash2,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Invoice, Customer, Vehicle } from "@/types/billing";
import InvoiceForm from "./InvoiceForm";
import MobileInvoiceCard from "./MobileInvoiceCard";

const InvoiceManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Sample data
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-20240101-001",
      invoiceType: "non-gst",
      customerId: "1",
      vehicleId: "1",
      items: [],
      subtotal: 2500,
      discount: 0,
      taxRate: 18,
      taxAmount: 450,
      extraCharges: [],
      total: 2950,
      status: "paid",
      createdAt: "2024-01-15T10:00:00Z",
      dueDate: "2024-02-15T10:00:00Z",
      paidAt: "2024-01-15T14:30:00Z",
      laborCharges: 500,
      payments: []
    },
    {
      id: "2",
      invoiceNumber: "INV-20240101-002",
      invoiceType: "non-gst",
      customerId: "2",
      vehicleId: "2",
      items: [],
      subtotal: 800,
      discount: 5,
      taxRate: 18,
      taxAmount: 136.8,
      extraCharges: [],
      total: 876.8,
      status: "pending",
      createdAt: "2024-01-14T09:00:00Z",
      dueDate: "2024-02-14T09:00:00Z",
      laborCharges: 200,
      payments: []
    },
    {
      id: "3",
      invoiceNumber: "INV-20240101-003",
      invoiceType: "non-gst",
      customerId: "1",
      vehicleId: "1",
      items: [],
      subtotal: 1200,
      discount: 0,
      taxRate: 18,
      taxAmount: 216,
      extraCharges: [],
      total: 1416,
      status: "overdue",
      createdAt: "2024-01-10T11:00:00Z",
      dueDate: "2024-01-25T11:00:00Z",
      laborCharges: 300,
      payments: []
    }
  ]);

  const customers: Customer[] = [
    { id: "1", name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@email.com", createdAt: "2024-01-01", totalSpent: 15000, loyaltyPoints: 150 },
    { id: "2", name: "Priya Sharma", phone: "9876543211", email: "priya@email.com", createdAt: "2024-01-01", totalSpent: 8000, loyaltyPoints: 80 }
  ];

  const vehicles: Vehicle[] = [
    { id: "1", customerId: "1", make: "Honda", model: "City", vehicleNumber: "TN 01 AB 1234", vehicleType: "car", createdAt: "2024-01-01" },
    { id: "2", customerId: "2", make: "Yamaha", model: "R15", vehicleNumber: "TN 02 CD 5678", vehicleType: "bike", createdAt: "2024-01-01" }
  ];

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || "Unknown Customer";
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle";
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      case 'draft': return 'outline';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(invoice.customerId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const invoiceDate = new Date(invoice.createdAt);
      const now = new Date();
      switch (dateFilter) {
        case "today":
          matchesDate = invoiceDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = invoiceDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = invoiceDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSaveInvoice = (invoice: Invoice) => {
    if (selectedInvoice) {
      setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
      toast.success("Invoice updated successfully!");
    } else {
      setInvoices([invoice, ...invoices]);
      toast.success("Invoice created successfully!");
    }
    setShowCreateForm(false);
    setSelectedInvoice(null);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowCreateForm(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    toast.success("Invoice deleted successfully!");
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    toast.info("Print functionality will be implemented with PDF generation");
  };

  const handleEmailInvoice = (invoice: Invoice) => {
    toast.info("Email functionality will be implemented");
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // For now, redirect to edit - this can be enhanced later with a view modal
    handleEditInvoice(invoice);
  };

  const invoiceStats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
  };

  if (showCreateForm) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <Button variant="outline" onClick={() => {
            setShowCreateForm(false);
            setSelectedInvoice(null);
          }} className="w-full sm:w-auto">
            Back to Invoices
          </Button>
        </div>
        
        <InvoiceForm 
          onSave={handleSaveInvoice}
          onCancel={() => {
            setShowCreateForm(false);
            setSelectedInvoice(null);
          }}
          existingInvoice={selectedInvoice || undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-sm md:text-base text-gray-600">Create, manage, and track all your invoices</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-blue-600">{invoiceStats.total}</p>
              <p className="text-xs md:text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-green-600">{invoiceStats.paid}</p>
              <p className="text-xs md:text-sm text-gray-600">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-yellow-600">{invoiceStats.pending}</p>
              <p className="text-xs md:text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-red-600">{invoiceStats.overdue}</p>
              <p className="text-xs md:text-sm text-gray-600">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-purple-600">₹{invoiceStats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs md:text-sm text-gray-600">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search by invoice number or customer..." 
                  className="pl-10 h-12 md:h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 md:h-10 md:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-12 md:h-10 md:w-40">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
          <CardDescription>Manage and track all your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No invoices found</p>
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Create First Invoice
                </Button>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(invoice.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">
                        {getCustomerName(invoice.customerId)} • {getVehicleInfo(invoice.vehicleId)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(invoice.createdAt).toLocaleDateString()}
                        {invoice.status === 'overdue' && (
                          <span className="text-red-500 ml-2">
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{invoice.total.toFixed(2)}</p>
                      <Badge variant={getStatusColor(invoice.status)} className="capitalize">
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEditInvoice(invoice)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditInvoice(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handlePrintInvoice(invoice)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEmailInvoice(invoice)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Invoices List */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Invoices ({filteredInvoices.length})</h3>
        </div>
        
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No invoices found</p>
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  Create First Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <MobileInvoiceCard
                key={invoice.id}
                invoice={invoice}
                customerName={getCustomerName(invoice.customerId)}
                vehicleInfo={getVehicleInfo(invoice.vehicleId)}
                onView={handleViewInvoice}
                onEdit={handleEditInvoice}
                onDelete={handleDeleteInvoice}
                onPrint={handlePrintInvoice}
                onEmail={handleEmailInvoice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;
