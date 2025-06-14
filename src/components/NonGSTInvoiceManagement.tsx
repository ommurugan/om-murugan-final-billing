
import NonGSTInvoiceForm from "./NonGSTInvoiceForm";
import NonGSTInvoiceHeader from "./invoice/NonGSTInvoiceHeader";
import NonGSTInvoiceContent from "./invoice/NonGSTInvoiceContent";
import NonGSTInvoiceFormHeader from "./invoice/NonGSTInvoiceFormHeader";
import { useNonGSTInvoiceState } from "@/hooks/useNonGSTInvoiceState";

const NonGSTInvoiceManagement = () => {
  const {
    showCreateForm,
    selectedInvoice,
    searchTerm,
    statusFilter,
    dateFilter,
    invoices,
    customers,
    vehicles,
    setShowCreateForm,
    setSelectedInvoice,
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    handleSaveInvoice,
    handleEditInvoice,
    handleDeleteInvoice,
    handlePrintInvoice,
    handleEmailInvoice,
    handleCreateFirst
  } = useNonGSTInvoiceState();

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

  return (
    <div className="space-y-4 md:space-y-6">
      <NonGSTInvoiceHeader onCreateInvoice={() => setShowCreateForm(true)} />
      
      <NonGSTInvoiceContent
        invoices={invoices}
        customers={customers}
        vehicles={vehicles}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onEmail={handleEmailInvoice}
        onPrint={handlePrintInvoice}
        onCreateFirst={handleCreateFirst}
      />
    </div>
  );
};

export default NonGSTInvoiceManagement;
