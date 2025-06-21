
import { useGSTInvoiceManagement } from "@/hooks/useGSTInvoiceManagement";
import GSTInvoiceCreateForm from "./gst-invoice/GSTInvoiceCreateForm";
import GSTInvoiceManagementContent from "./gst-invoice/GSTInvoiceManagementContent";
import GSTInvoiceModals from "./gst-invoice/GSTInvoiceModals";

const GSTInvoiceManagement = () => {
  const {
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
  } = useGSTInvoiceManagement();

  if (showCreateForm) {
    return (
      <GSTInvoiceCreateForm
        selectedInvoice={selectedInvoice}
        onSave={handleSaveInvoice}
        onCancel={handleCloseCreateForm}
      />
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
    <>
      <GSTInvoiceManagementContent
        filteredInvoices={filteredInvoices}
        invoiceStats={invoiceStats}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onCreateInvoice={() => setShowCreateForm(true)}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
        onView={handleViewInvoice}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onPrint={handlePrintInvoice}
        onCreateFirst={handleCreateFirst}
        getCustomerName={getCustomerName}
        getCustomerGST={getCustomerGST}
        getVehicleInfo={getVehicleInfo}
      />

      <GSTInvoiceModals
        showViewModal={showViewModal}
        showPrintPreview={showPrintPreview}
        selectedInvoice={selectedInvoice}
        onCloseViewModal={handleCloseViewModal}
        onClosePrintPreview={handleClosePrintPreview}
        onEditInvoice={() => {
          handleCloseViewModal();
          setShowCreateForm(true);
        }}
        onPrintInvoice={handlePrintInvoice}
      />
    </>
  );
};

export default GSTInvoiceManagement;
