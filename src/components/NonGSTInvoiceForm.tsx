
import { useState } from "react";
import { Invoice } from "@/types/billing";
import ProfessionalInvoicePrint from "./ProfessionalInvoicePrint";
import CustomerSection from "./invoice/CustomerSection";
import ServicesSection from "./invoice/ServicesSection";
import PaymentSection from "./invoice/PaymentSection";
import InvoiceActionButtons from "./invoice/InvoiceActionButtons";
import CustomerQuickAdd from "./CustomerQuickAdd";
import { useNonGSTInvoiceForm } from "@/hooks/useNonGSTInvoiceForm";
import { useNonGSTInvoiceFormActions } from "./invoice/NonGSTInvoiceFormActions";

interface NonGSTInvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const NonGSTInvoiceForm = ({
  onSave,
  onCancel,
  existingInvoice
}: NonGSTInvoiceFormProps) => {
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const formState = useNonGSTInvoiceForm({
    onSave: (invoice: Invoice) => {
      onSave(invoice);
      // Auto-show print preview after successful creation
      setShowPrintPreview(true);
    },
    onCancel,
    existingInvoice
  });

  const {
    selectedCustomer,
    selectedVehicle,
    kilometers,
    invoiceItems,
    laborCharges,
    discount,
    taxRate,
    extraCharges,
    notes,
    paymentMethod,
    paymentAmount,
    subtotal,
    total,
    createInvoiceMutation,
    setSelectedCustomer,
    setSelectedVehicle,
    setKilometers,
    setLaborCharges,
    setDiscount,
    setTaxRate,
    setExtraCharges,
    setNotes,
    setPaymentMethod,
    setPaymentAmount,
    addService,
    addPart,
    removeItem,
    updateItemQuantity,
    updateItemDiscount,
    createInvoiceObject,
    handleCustomerAdded
  } = formState;

  const formActions = useNonGSTInvoiceFormActions({
    selectedCustomer,
    selectedVehicle,
    invoiceItems,
    createInvoiceObject,
    createInvoiceMutation,
    onSave: (invoice: Invoice) => {
      onSave(invoice);
      // Auto-show print preview after successful creation
      setShowPrintPreview(true);
    }
  });

  const handlePrintPreview = () => {
    const shouldShowPreview = formActions.handlePrintPreview();
    if (shouldShowPreview) {
      setShowPrintPreview(true);
    }
  };

  if (showPrintPreview && selectedCustomer && selectedVehicle) {
    const previewInvoice = createInvoiceObject('draft');
    return (
      <ProfessionalInvoicePrint
        invoice={previewInvoice}
        customer={selectedCustomer}
        vehicle={selectedVehicle}
        onClose={() => setShowPrintPreview(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CustomerSection
        selectedCustomer={selectedCustomer}
        selectedVehicle={selectedVehicle}
        kilometers={kilometers}
        onCustomerChange={setSelectedCustomer}
        onVehicleChange={setSelectedVehicle}
        onKilometersChange={setKilometers}
        onCustomerAdded={handleCustomerAdded}
        CustomerQuickAddComponent={CustomerQuickAdd}
      />

      <ServicesSection
        invoiceItems={invoiceItems}
        onAddService={addService}
        onAddPart={addPart}
        onRemoveItem={removeItem}
        onUpdateItemQuantity={updateItemQuantity}
        onUpdateItemDiscount={updateItemDiscount}
      />

      <PaymentSection
        laborCharges={laborCharges}
        extraCharges={extraCharges}
        discount={discount}
        taxRate={taxRate}
        notes={notes}
        paymentMethod={paymentMethod}
        paymentAmount={paymentAmount}
        onLaborChargesChange={setLaborCharges}
        onExtraChargesChange={setExtraCharges}
        onDiscountChange={setDiscount}
        onTaxRateChange={setTaxRate}
        onNotesChange={setNotes}
        onPaymentMethodChange={setPaymentMethod}
        onPaymentAmountChange={setPaymentAmount}
        subtotal={subtotal}
        total={total}
      />

      <InvoiceActionButtons
        onSaveDraft={formActions.handleSaveDraft}
        onCreateInvoice={formActions.handleCreateInvoice}
        onPrintPreview={handlePrintPreview}
        onCancel={onCancel}
        isLoading={createInvoiceMutation.isPending}
        showSaveDraft={false} // Hide Save as Draft for non-GST invoices
      />
    </div>
  );
};

export default NonGSTInvoiceForm;
