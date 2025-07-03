
import { useState } from "react";
import { toast } from "sonner";
import { Invoice } from "@/types/billing";
import { InvoiceWithDetails } from "@/types/invoiceWithDetails";
import { useInvoicesWithDetails } from "@/hooks/useInvoicesWithDetails";
import { useGSTInvoiceNavigation } from "@/hooks/useGSTInvoiceNavigation";
import GSTInvoiceHeader from "./GSTInvoiceHeader";
import GSTInvoiceStats from "./GSTInvoiceStats";
import GSTInvoiceFilters from "./GSTInvoiceFilters";
import GSTInvoiceList from "./GSTInvoiceList";
import GSTInvoiceModals from "./GSTInvoiceModals";
import GSTInvoiceCreateForm from "./GSTInvoiceCreateForm";

const GSTInvoiceManagementContent = () => {
  const { data: allInvoices = [], refetch } = useInvoicesWithDetails();
  const { selectedInvoice, isEditing, clearEdit } = useGSTInvoiceNavigation();
  
  // Filter for GST invoices only
  const invoices = allInvoices.filter(invoice => invoice.invoiceType === 'gst');
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [viewSelectedInvoice, setViewSelectedInvoice] = useState<InvoiceWithDetails | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'this_month'
  });

  // Filter invoices based on current filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filters.status === 'all' || invoice.status === filters.status;
    const matchesSearch = !filters.search || 
      invoice.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      invoice.vehicle?.vehicleNumber.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calculate stats from invoices
  const total = invoices.length;
  const paid = invoices.filter(inv => inv.status === 'paid').length;
  const pending = invoices.filter(inv => inv.status === 'pending').length;
  const overdue = invoices.filter(inv => inv.status === 'overdue').length;
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleSaveInvoice = async (invoiceData: Invoice) => {
    try {
      await refetch();
      toast.success(selectedInvoice ? "Invoice updated successfully!" : "Invoice created successfully!");
      
      if (isEditing) {
        clearEdit();
      } else {
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
    }
  };

  const handleCancelCreate = () => {
    if (isEditing) {
      clearEdit();
    } else {
      setShowCreateForm(false);
    }
  };

  const handleViewInvoice = (invoice: InvoiceWithDetails) => {
    setViewSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditFromView = () => {
    if (viewSelectedInvoice) {
      setShowViewModal(false);
      clearEdit(); // Clear any existing edit state
      // Set up the edit with the viewed invoice
      const params = new URLSearchParams();
      params.set('edit', viewSelectedInvoice.id);
      params.set('type', 'gst');
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
      window.location.reload(); // Force reload to pick up the new params
    }
  };

  const handlePrintFromView = (invoice: InvoiceWithDetails) => {
    setViewSelectedInvoice(invoice);
    setShowViewModal(false);
    setShowPrintPreview(true);
  };

  // Show create/edit form if creating new or editing existing
  if (showCreateForm || isEditing) {
    return (
      <GSTInvoiceCreateForm
        selectedInvoice={selectedInvoice}
        onSave={handleSaveInvoice}
        onCancel={handleCancelCreate}
      />
    );
  }

  return (
    <div className="space-y-6">
      <GSTInvoiceHeader 
        onCreateInvoice={handleCreateNew}
      />
      <GSTInvoiceStats 
        total={total}
        paid={paid}
        pending={pending}
        overdue={overdue}
        totalRevenue={totalRevenue}
      />
      <GSTInvoiceFilters 
        searchTerm={filters.search}
        statusFilter={filters.status}
        dateFilter={filters.dateRange}
        onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
        onStatusFilterChange={(status) => setFilters(prev => ({ ...prev, status }))}
        onDateFilterChange={(dateRange) => setFilters(prev => ({ ...prev, dateRange }))}
      />
      <GSTInvoiceList 
        invoices={filteredInvoices}
        onView={handleViewInvoice}
        onEdit={(invoice) => {
          const params = new URLSearchParams();
          params.set('edit', invoice.id);
          params.set('type', 'gst');
          window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
          window.location.reload();
        }}
        onDelete={() => {}} // Placeholder
        onPrint={handlePrintFromView}
        onCreateFirst={handleCreateNew}
        onRefresh={refetch}
        getCustomerName={(invoice) => invoice.customer?.name || 'Unknown'}
        getCustomerGST={(invoice) => invoice.customer?.gstNumber || ''}
        getVehicleInfo={(invoice) => invoice.vehicle ? `${invoice.vehicle.make} ${invoice.vehicle.model} (${invoice.vehicle.vehicleNumber})` : 'Unknown'}
      />
      
      <GSTInvoiceModals
        showViewModal={showViewModal}
        showPrintPreview={showPrintPreview}
        selectedInvoice={viewSelectedInvoice}
        onCloseViewModal={() => {
          setShowViewModal(false);
          setViewSelectedInvoice(null);
        }}
        onClosePrintPreview={() => {
          setShowPrintPreview(false);
          setViewSelectedInvoice(null);
        }}
        onEditInvoice={handleEditFromView}
        onPrintInvoice={handlePrintFromView}
      />
    </div>
  );
};

export default GSTInvoiceManagementContent;
