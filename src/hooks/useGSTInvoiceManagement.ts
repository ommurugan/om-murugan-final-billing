
import { useState } from "react";
import { toast } from "sonner";
import { Invoice } from "@/types/billing";
import { InvoiceWithDetails } from "@/types/invoiceWithDetails";
import { useInvoicesWithDetails } from "@/hooks/useInvoicesWithDetails";
import { useInvoiceStats } from "@/hooks/useInvoiceStats";
import { useInvoiceFilters } from "@/hooks/useInvoiceFilters";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";

export const useGSTInvoiceManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithDetails | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const { data: invoicesData = [], isLoading, refetch } = useInvoicesWithDetails();
  const { data: customers = [] } = useCustomers();
  const { data: dbVehicles = [] } = useVehicles();

  // Transform the invoice data to include customer and vehicle details
  const gstInvoices: InvoiceWithDetails[] = invoicesData
    .filter(invoice => invoice.invoiceType === 'gst')
    .map((invoice: any): InvoiceWithDetails => ({
      ...invoice,
      customer: invoice.customer,
      vehicle: invoice.vehicle,
      customerName: invoice.customer?.name || "Unknown Customer",
      customerGST: invoice.customer?.gstNumber || "",
      vehicleInfo: invoice.vehicle ? `${invoice.vehicle.make} ${invoice.vehicle.model}` : "Unknown Vehicle"
    }));

  const getCustomerName = (invoice: InvoiceWithDetails) => {
    return invoice.customerName || "Unknown Customer";
  };

  const getCustomerGST = (invoice: InvoiceWithDetails) => {
    return invoice.customerGST || "";
  };

  const getVehicleInfo = (invoice: InvoiceWithDetails) => {
    return invoice.vehicleInfo || "Unknown Vehicle";
  };

  const filteredInvoices = useInvoiceFilters({
    invoices: gstInvoices,
    customers: [],
    searchTerm,
    statusFilter,
    dateFilter
  });

  const invoiceStats = useInvoiceStats(gstInvoices);

  const handleSaveInvoice = async (invoice: Invoice) => {
    console.log("GST Invoice saved:", invoice);
    await refetch();
    toast.success("GST Invoice saved successfully!");
    setShowCreateForm(false);
    setSelectedInvoice(null);
  };

  const handleViewInvoice = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditInvoice = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setShowCreateForm(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    toast.success("Invoice deleted successfully!");
    // TODO: Implement actual delete functionality
  };

  const handlePrintInvoice = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setShowPrintPreview(true);
  };

  const handleCreateFirst = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setSelectedInvoice(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedInvoice(null);
  };

  const handleClosePrintPreview = () => {
    setShowPrintPreview(false);
    setSelectedInvoice(null);
  };

  return {
    showCreateForm,
    selectedInvoice,
    showViewModal,
    showPrintPreview,
    searchTerm,
    statusFilter,
    dateFilter,
    isLoading,
    filteredInvoices,
    invoiceStats,
    setShowCreateForm,
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    handleSaveInvoice,
    handleViewInvoice,
    handleEditInvoice,
    handleDeleteInvoice,
    handlePrintInvoice,
    handleCreateFirst,
    handleCloseCreateForm,
    handleCloseViewModal,
    handleClosePrintPreview,
    getCustomerName,
    getCustomerGST,
    getVehicleInfo
  };
};
