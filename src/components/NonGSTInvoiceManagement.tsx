
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Invoice, Customer, Vehicle } from "@/types/billing";
import NonGSTInvoiceForm from "./NonGSTInvoiceForm";
import MobileInvoiceCard from "./MobileInvoiceCard";
import InvoiceStatsCards from "./invoice/InvoiceStatsCards";
import InvoiceFilters from "./invoice/InvoiceFilters";
import InvoiceList from "./invoice/InvoiceList";
import { useInvoiceStats } from "@/hooks/useInvoiceStats";
import { useInvoiceFilters } from "@/hooks/useInvoiceFilters";

const NonGSTInvoiceManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Sample data - Non-GST invoices only
  const [invoices, setInvoices] = useState<Invoice[]>([{
    id: "1",
    invoiceNumber: "INV-20240101-001",
    invoiceType: "non-gst",
    customerId: "1",
    vehicleId: "1",
    items: [],
    subtotal: 2500,
    discount: 0,
    taxRate: 0,
    taxAmount: 0,
    extraCharges: [],
    total: 2500,
    status: "paid",
    createdAt: "2024-01-15T10:00:00Z",
    dueDate: "2024-02-15T10:00:00Z",
    paidAt: "2024-01-15T14:30:00Z",
    laborCharges: 500,
    payments: [],
    kilometers: 45000
  }, {
    id: "2",
    invoiceNumber: "INV-20240101-002",
    invoiceType: "non-gst",
    customerId: "2",
    vehicleId: "2",
    items: [],
    subtotal: 800,
    discount: 5,
    taxRate: 0,
    taxAmount: 0,
    extraCharges: [],
    total: 760,
    status: "pending",
    createdAt: "2024-01-14T09:00:00Z",
    dueDate: "2024-02-14T09:00:00Z",
    laborCharges: 200,
    payments: [],
    kilometers: 23000
  }]);

  const customers: Customer[] = [{
    id: "1",
    name: "Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh@email.com",
    createdAt: "2024-01-01",
    totalSpent: 15000,
    loyaltyPoints: 150
  }, {
    id: "2",
    name: "Priya Sharma",
    phone: "9876543211",
    email: "priya@email.com",
    createdAt: "2024-01-01",
    totalSpent: 8000,
    loyaltyPoints: 80
  }];

  const vehicles: Vehicle[] = [{
    id: "1",
    customerId: "1",
    make: "Honda",
    model: "City",
    vehicleNumber: "TN 01 AB 1234",
    vehicleType: "car",
    createdAt: "2024-01-01"
  }, {
    id: "2",
    customerId: "2",
    make: "Yamaha",
    model: "R15",
    vehicleNumber: "TN 02 CD 5678",
    vehicleType: "bike",
    createdAt: "2024-01-01"
  }];

  // Use custom hooks
  const invoiceStats = useInvoiceStats(invoices);
  const filteredInvoices = useInvoiceFilters({
    invoices,
    customers,
    searchTerm,
    statusFilter,
    dateFilter
  });

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || "Unknown Customer";
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle";
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    const invoiceWithType = {
      ...invoice,
      invoiceType: 'non-gst' as const
    };
    if (selectedInvoice) {
      setInvoices(invoices.map(inv => inv.id === invoice.id ? invoiceWithType : inv));
      toast.success("Non-GST Invoice updated successfully!");
    } else {
      setInvoices([invoiceWithType, ...invoices]);
      toast.success("Non-GST Invoice created successfully!");
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

  const handleCreateFirst = () => {
    setShowCreateForm(true);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {selectedInvoice ? 'Edit Non-GST Invoice' : 'Create New Non-GST Invoice'}
          </h2>
          <Button variant="outline" onClick={() => {
            setShowCreateForm(false);
            setSelectedInvoice(null);
          }} className="w-full sm:w-auto">
            Back to Non-GST Invoices
          </Button>
        </div>
        
        <NonGSTInvoiceForm 
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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Non-GST Invoice Management</h1>
          <p className="text-sm md:text-base text-gray-600">Create and manage non-GST invoices</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Non-GST Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <InvoiceStatsCards {...invoiceStats} />

      {/* Filters */}
      <InvoiceFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
      />

      {/* Desktop Invoices List */}
      <InvoiceList
        invoices={filteredInvoices}
        customers={customers}
        vehicles={vehicles}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onEmail={handleEmailInvoice}
        onCreateFirst={handleCreateFirst}
      />

      {/* Mobile Invoices List */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Non-GST Invoices ({filteredInvoices.length})</h3>
        </div>
        
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No non-GST invoices found</p>
                <Button onClick={handleCreateFirst} className="bg-blue-600 hover:bg-blue-700 w-full">
                  Create First Non-GST Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map(invoice => (
              <MobileInvoiceCard 
                key={invoice.id} 
                invoice={invoice} 
                customerName={getCustomerName(invoice.customerId)} 
                vehicleInfo={getVehicleInfo(invoice.vehicleId)} 
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

export default NonGSTInvoiceManagement;
