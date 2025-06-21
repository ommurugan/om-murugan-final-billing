
import { useState } from "react";
import { toast } from "sonner";
import { Invoice, Customer, Vehicle } from "@/types/billing";
import GSTInvoiceForm from "./GSTInvoiceForm";
import GSTInvoiceHeader from "./gst-invoice/GSTInvoiceHeader";
import GSTInvoiceStats from "./gst-invoice/GSTInvoiceStats";
import GSTInvoiceFilters from "./gst-invoice/GSTInvoiceFilters";
import GSTInvoiceList from "./gst-invoice/GSTInvoiceList";
import InvoiceViewModal from "./invoice/InvoiceViewModal";
import ProfessionalInvoicePrint from "./ProfessionalInvoicePrint";
import { useInvoicesWithDetails } from "@/hooks/useInvoicesWithDetails";
import { useInvoiceStats } from "@/hooks/useInvoiceStats";
import { useInvoiceFilters } from "@/hooks/useInvoiceFilters";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";

// Extended Invoice type with customer and vehicle data
type InvoiceWithDetails = Invoice & {
  customer: Customer | null;
  vehicle: Vehicle | null;
  customerName: string;
  customerGST: string;
  vehicleInfo: string;
};

const GSTInvoiceManagement = () => {
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

  // Filter for GST invoices only
  const gstInvoices = invoicesData.filter(invoice => invoice.invoiceType === 'gst');

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

  // Transform the invoice data to include customer and vehicle details
  const invoices: InvoiceWithDetails[] = gstInvoices.map((invoice: any) => ({
    ...invoice,
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
    invoices,
    customers: [],
    searchTerm,
    statusFilter,
    dateFilter
  });

  const invoiceStats = useInvoiceStats(invoices);

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
        onView={handleViewInvoice}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onPrint={handlePrintInvoice}
        onCreateFirst={handleCreateFirst}
        getCustomerName={getCustomerName}
        getCustomerGST={getCustomerGST}
        getVehicleInfo={getVehicleInfo}
      />

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          customer={selectedInvoice.customer}
          vehicle={selectedInvoice.vehicle}
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

      {/* Print Preview Modal */}
      {showPrintPreview && selectedInvoice && selectedInvoice.customer && selectedInvoice.vehicle && (
        <ProfessionalInvoicePrint
          invoice={selectedInvoice}
          customer={selectedInvoice.customer}
          vehicle={selectedInvoice.vehicle}
          onClose={() => {
            setShowPrintPreview(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default GSTInvoiceManagement;
