
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Invoice } from "@/types/billing";
import { useInvoicesWithDetails } from "@/hooks/useInvoicesWithDetails";
import InvoiceViewModal from "./invoice/InvoiceViewModal";
import NonGSTInvoiceForm from "./NonGSTInvoiceForm";
import { useInvoices } from "@/hooks/useInvoices";

const NonGSTInvoiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Get all invoices and filter for non-GST ones
  const { 
    data: allInvoices = [], 
    isLoading, 
    error 
  } = useInvoicesWithDetails();

  // Filter for non-GST invoices
  const invoices = allInvoices.filter(invoice => invoice.invoiceType === 'non-gst');

  const { useDeleteInvoice } = useInvoices();
  const deleteInvoiceMutation = useDeleteInvoice();

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vehicle?.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowCreateForm(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowCreateForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
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

  const handleSaveInvoice = async (invoiceData: Invoice) => {
    try {
      // Handle saving logic here
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Non-GST Invoices</h2>
          <p className="text-gray-600">Manage your non-GST invoices</p>
        </div>
        <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by invoice number, customer name, or vehicle number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No invoices match your search criteria." : "Get started by creating your first invoice."}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Customer:</span> {invoice.customer?.name || "Unknown"}</p>
                          <p><span className="font-medium">Vehicle:</span> {invoice.vehicle?.vehicleNumber || "Unknown"}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                          <p><span className="font-medium">Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Amount:</span> ₹{invoice.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showViewModal && selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoice(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEditInvoice(selectedInvoice);
          }}
          onPrint={() => {
            toast.info("Print functionality will be implemented");
          }}
        />
      )}
    </div>
  );
};

export default NonGSTInvoiceManagement;
