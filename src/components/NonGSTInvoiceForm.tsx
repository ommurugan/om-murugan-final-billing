
import { Invoice } from "@/types/billing";
import InvoicePrintPreview from "./InvoicePrintPreview";
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
  const formState = useNonGSTInvoiceForm({
    onSave,
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
    showPrintPreview,
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
    setShowPrintPreview,
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
    onSave
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
      <InvoicePrintPreview
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
      />
    </div>
  );
};

export default NonGSTInvoiceForm;
