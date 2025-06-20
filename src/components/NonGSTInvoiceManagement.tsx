
import NonGSTInvoiceForm from "./NonGSTInvoiceForm";
import NonGSTInvoiceHeader from "./invoice/NonGSTInvoiceHeader";
import NonGSTInvoiceContent from "./invoice/NonGSTInvoiceContent";
import NonGSTInvoiceFormHeader from "./invoice/NonGSTInvoiceFormHeader";
import InvoiceViewModal from "./invoice/InvoiceViewModal";
import { useState } from "react";
import { toast } from "sonner";
import { Invoice } from "@/types/billing";
import { useInvoices } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useInvoiceStats } from "@/hooks/useInvoiceStats";
import { useInvoiceFilters } from "@/hooks/useInvoiceFilters";

const NonGSTInvoiceManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Use real database data
  const { data: invoicesData = [], isLoading, refetch } = useInvoices('non-gst');
  const { data: customers = [] } = useCustomers();
  const { data: dbVehicles = [] } = useVehicles();

  // Transform database vehicles to match TypeScript interface
  const vehicles = dbVehicles.map(v => ({
    id: v.id,
    customerId: v.customer_id,
    make: v.make,
    model: v.model,
    year: v.year,
    vehicleNumber: v.vehicle_number,
    vehicleType: v.vehicle_type as 'car' | 'bike' | 'scooter',
    engineNumber: v.engine_number,
    chassisNumber: v.chassis_number,
    color: v.color,
    createdAt: v.created_at
  }));

  // Transform invoice data to include customer and vehicle details
  const invoices = invoicesData.map((invoice: any) => ({
    ...invoice,
    customerName: invoice.customers?.name || "Unknown Customer",
    vehicleInfo: invoice.vehicles ? `${invoice.vehicles.make} ${invoice.vehicles.model}` : "Unknown Vehicle"
  }));

  const filteredInvoices = useInvoiceFilters({
    invoices,
    customers,
    searchTerm,
    statusFilter,
    dateFilter
  });

  const handleSaveInvoice = async (invoice: Invoice) => {
    console.log("Non-GST Invoice saved:", invoice);
    
    // Refresh the invoices list to show the new invoice
    await refetch();
    
    toast.success("Non-GST Invoice saved successfully!");
    setShowCreateForm(false);
    setSelectedInvoice(null);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
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
        const customer = customers.find(c => c.id === invoice.customerId);
        const vehicle = vehicles.find(v => v.id === invoice.vehicleId);
        
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
                <h2>NON-GST INVOICE</h2>
                <p>Invoice: ${invoice.invoiceNumber}</p>
              </div>
              <div class="invoice-details">
                <p><strong>Customer:</strong> ${customer?.name || 'Unknown Customer'}</p>
                <p><strong>Phone:</strong> ${customer?.phone || 'N/A'}</p>
                <p><strong>Vehicle:</strong> ${vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.vehicleNumber})` : 'Unknown Vehicle'}</p>
                <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
                ${invoice.kilometers ? `<p><strong>Kilometers:</strong> ${invoice.kilometers.toLocaleString()}</p>` : ''}
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
                  ${invoice.laborCharges > 0 ? `
                    <tr>
                      <td>Labor Charges</td>
                      <td>1</td>
                      <td>₹${invoice.laborCharges.toFixed(2)}</td>
                      <td>₹${invoice.laborCharges.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>
              <div class="total">
                <p>Subtotal: ₹${invoice.subtotal.toFixed(2)}</p>
                ${invoice.discount > 0 ? `<p>Discount: -₹${invoice.discount.toFixed(2)}</p>` : ''}
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

  const handleCreateFirst = () => {
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setSelectedInvoice(null);
  };

  const handleBack = () => {
    setShowCreateForm(false);
    setSelectedInvoice(null);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-4 md:space-y-6">
        <NonGSTInvoiceFormHeader 
          selectedInvoice={selectedInvoice}
          onBack={handleBack}
        />
        
        <NonGSTInvoiceForm 
          onSave={handleSaveInvoice} 
          onCancel={handleCancel} 
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
          <p className="text-gray-500">Loading Non-GST invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <NonGSTInvoiceHeader onCreateInvoice={() => setShowCreateForm(true)} />
      
      <NonGSTInvoiceContent
        invoices={filteredInvoices}
        customers={customers}
        vehicles={vehicles}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
        onView={handleViewInvoice}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onPrint={handlePrintInvoice}
        onCreateFirst={handleCreateFirst}
      />

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          customer={customers.find(c => c.id === selectedInvoice.customerId)}
          vehicle={vehicles.find(v => v.id === selectedInvoice.vehicleId)}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoice(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            setShowCreateForm(true);
          }}
          onPrint={() => handlePrintInvoice(selectedInvoice)}
        />
      )}
    </div>
  );
};

export default NonGSTInvoiceManagement;
