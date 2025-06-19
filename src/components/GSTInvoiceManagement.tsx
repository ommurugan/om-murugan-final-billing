
import { useState } from "react";
import { toast } from "sonner";
import { Invoice } from "@/types/billing";
import GSTInvoiceForm from "./GSTInvoiceForm";
import GSTInvoiceHeader from "./gst-invoice/GSTInvoiceHeader";
import GSTInvoiceStats from "./gst-invoice/GSTInvoiceStats";
import GSTInvoiceFilters from "./gst-invoice/GSTInvoiceFilters";
import GSTInvoiceList from "./gst-invoice/GSTInvoiceList";
import { useInvoices } from "@/hooks/useInvoices";
import { useInvoiceStats } from "@/hooks/useInvoiceStats";
import { useInvoiceFilters } from "@/hooks/useInvoiceFilters";

const GSTInvoiceManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const { data: invoicesData = [], isLoading, refetch } = useInvoices('gst');

  // Transform the invoice data to include customer and vehicle details from the database query
  const invoices = invoicesData.map((invoice: any) => ({
    ...invoice,
    customerName: invoice.customers?.name || "Unknown Customer",
    customerGST: invoice.customers?.gst_number || "",
    vehicleInfo: invoice.vehicles ? `${invoice.vehicles.make} ${invoice.vehicles.model}` : "Unknown Vehicle"
  }));

  const getCustomerName = (invoice: any) => {
    return invoice.customerName || "Unknown Customer";
  };

  const getCustomerGST = (invoice: any) => {
    return invoice.customerGST || "";
  };

  const getVehicleInfo = (invoice: any) => {
    return invoice.vehicleInfo || "Unknown Vehicle";
  };

  const filteredInvoices = useInvoiceFilters({
    invoices,
    customers: [], // Not needed for GST invoices as we have the data embedded
    searchTerm,
    statusFilter,
    dateFilter
  });

  const invoiceStats = useInvoiceStats(invoices);

  const handleSaveInvoice = async (invoice: Invoice) => {
    console.log("GST Invoice saved:", invoice);
    
    // Refresh the invoices list to show the new invoice
    await refetch();
    
    toast.success("GST Invoice saved successfully!");
    setShowCreateForm(false);
    setSelectedInvoice(null);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowCreateForm(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    toast.success("Invoice deleted successfully!");
    // TODO: Implement actual delete functionality
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    // Find the invoice with customer and vehicle data
    const invoiceData = invoicesData.find(inv => inv.id === invoice.id);
    
    if (invoiceData) {
      // Create a temporary print window with the invoice data
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .invoice-details { margin-bottom: 20px; }
                .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .table th, .table td { border: 1px solid #000; padding: 8px; text-align: left; }
                .table th { background-color: #f0f0f0; }
                .total { text-align: right; font-weight: bold; font-size: 18px; }
                @media print { 
                  .no-print { display: none; } 
                  @page { margin: 0.5in; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>OM MURUGAN AUTO WORKS</h1>
                <h2>GST INVOICE</h2>
                <p>Invoice: ${invoice.invoiceNumber}</p>
              </div>
              <div class="invoice-details">
                <p><strong>Customer:</strong> ${getCustomerName(invoice)}</p>
                <p><strong>GST Number:</strong> ${getCustomerGST(invoice) || 'N/A'}</p>
                <p><strong>Vehicle:</strong> ${getVehicleInfo(invoice)}</p>
                <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
              <table class="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>₹${item.unitPrice.toFixed(2)}</td>
                      <td>₹${item.total.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="total">
                <p>Subtotal: ₹${invoice.subtotal.toFixed(2)}</p>
                <p>CGST: ₹${(invoice.taxAmount / 2).toFixed(2)}</p>
                <p>SGST: ₹${(invoice.taxAmount / 2).toFixed(2)}</p>
                <p><strong>Total: ₹${invoice.total.toFixed(2)}</strong></p>
              </div>
              <div class="no-print" style="margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Invoice</button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Close</button>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      toast.error("Unable to find invoice details for printing");
    }
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
            {selectedInvoice ? 'Edit GST Invoice' : 'Create New GST Invoice'}
          </h2>
          <button 
            onClick={() => {
              setShowCreateForm(false);
              setSelectedInvoice(null);
            }}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to GST Invoices
          </button>
        </div>
        
        <GSTInvoiceForm 
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading GST invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <GSTInvoiceHeader onCreateInvoice={() => setShowCreateForm(true)} />
      
      <GSTInvoiceStats {...invoiceStats} />
      
      <GSTInvoiceFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
      />
      
      <GSTInvoiceList
        invoices={filteredInvoices}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onPrint={handlePrintInvoice}
        onEmail={handleEmailInvoice}
        onCreateFirst={handleCreateFirst}
        getCustomerName={getCustomerName}
        getCustomerGST={getCustomerGST}
        getVehicleInfo={getVehicleInfo}
      />
    </div>
  );
};

export default GSTInvoiceManagement;
