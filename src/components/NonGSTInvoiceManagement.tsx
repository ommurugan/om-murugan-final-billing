
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Invoice } from "@/types/billing";
import { useInvoicesWithDetails } from "@/hooks/useInvoicesWithDetails";
import NonGSTInvoiceForm from "./NonGSTInvoiceForm";
import { useDeleteInvoice } from "@/hooks/useInvoices";
import { supabase } from "@/integrations/supabase/client";
import NonGSTInvoiceHeader from "./non-gst-invoice/NonGSTInvoiceHeader";
import NonGSTInvoiceFilters from "./non-gst-invoice/NonGSTInvoiceFilters";
import NonGSTInvoiceListItem from "./non-gst-invoice/NonGSTInvoiceListItem";
import NonGSTInvoiceEmptyState from "./non-gst-invoice/NonGSTInvoiceEmptyState";
import NonGSTInvoiceModals from "./non-gst-invoice/NonGSTInvoiceModals";

const NonGSTInvoiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const { 
    data: allInvoices = [], 
    isLoading, 
    error,
    refetch 
  } = useInvoicesWithDetails();

  const invoices = allInvoices.filter(invoice => invoice.invoiceType === 'non-gst');
  const deleteInvoiceMutation = useDeleteInvoice();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vehicle?.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowCreateForm(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowCreateForm(true);
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handlePrintInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowPrintPreview(true);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoiceMutation.mutateAsync(invoiceId);
        toast.success("Invoice deleted successfully");
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error("Failed to delete invoice");
      }
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      if (error) throw error;

      await refetch();
      toast.success("Invoice marked as paid!");
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to mark invoice as paid");
    }
  };

  const handleSaveInvoice = async (invoiceData: Invoice) => {
    try {
      toast.success(editingInvoice ? "Invoice updated successfully!" : "Invoice created successfully!");
      setShowCreateForm(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingInvoice(null);
  };

  if (showCreateForm) {
    return (
      <NonGSTInvoiceForm
        onSave={handleSaveInvoice}
        onCancel={handleCancel}
        existingInvoice={editingInvoice}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading invoices</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NonGSTInvoiceHeader onCreateInvoice={handleCreateInvoice} />

      <Card>
        <CardContent className="pt-6">
          <NonGSTInvoiceFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
          />

          {filteredInvoices.length === 0 ? (
            <NonGSTInvoiceEmptyState
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onCreateInvoice={handleCreateInvoice}
            />
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <NonGSTInvoiceListItem
                  key={invoice.id}
                  invoice={invoice}
                  onView={handleViewInvoice}
                  onEdit={handleEditInvoice}
                  onDelete={handleDeleteInvoice}
                  onPrint={handlePrintInvoice}
                  onMarkAsPaid={handleMarkAsPaid}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <NonGSTInvoiceModals
        showViewModal={showViewModal}
        showPrintPreview={showPrintPreview}
        selectedInvoice={selectedInvoice}
        onCloseViewModal={() => {
          setShowViewModal(false);
          setSelectedInvoice(null);
        }}
        onClosePrintPreview={() => {
          setShowPrintPreview(false);
          setSelectedInvoice(null);
        }}
        onEditInvoice={handleEditInvoice}
        onPrintInvoice={handlePrintInvoice}
      />
    </div>
  );
};

export default NonGSTInvoiceManagement;
