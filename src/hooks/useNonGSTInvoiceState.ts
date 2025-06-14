
import { useState } from "react";
import { Invoice, Customer, Vehicle } from "@/types/billing";
import { toast } from "sonner";

export const useNonGSTInvoiceState = () => {
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

  return {
    // State
    showCreateForm,
    selectedInvoice,
    searchTerm,
    statusFilter,
    dateFilter,
    invoices,
    customers,
    vehicles,
    // Setters
    setShowCreateForm,
    setSelectedInvoice,
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    // Handlers
    handleSaveInvoice,
    handleEditInvoice,
    handleDeleteInvoice,
    handlePrintInvoice,
    handleEmailInvoice,
    handleCreateFirst
  };
};
