
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Customer, Vehicle, Invoice, Payment } from "@/types/billing";
import InvoicePrintPreview from "../InvoicePrintPreview";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import { useDataTransformations } from "@/hooks/useDataTransformations";
import { useInvoiceCreation } from "@/hooks/useInvoiceCreation";
import InvoiceFormData from "./InvoiceFormData";
import InvoiceFormActions from "./InvoiceFormActions";

interface InvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const InvoiceForm = ({ onSave, onCancel, existingInvoice }: InvoiceFormProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [kilometers, setKilometers] = useState(0);

  // Fetch services and parts
  const { data: servicesData = [] } = useServices();
  const { data: partsData = [] } = useParts();

  console.log("Services data:", servicesData);
  console.log("Parts data:", partsData);
  console.log("Selected customer:", selectedCustomer);

  // Use custom hooks
  const {
    invoiceItems,
    addService: addServiceToItems,
    addPart: addPartToItems,
    removeItem,
    updateItemQuantity,
    updateItemDiscount
  } = useInvoiceOperations();

  const { transformedServices, transformedParts } = useDataTransformations({
    vehiclesData: [],
    servicesData,
    partsData
  });

  const [laborCharges, setLaborCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18);
  const [extraCharges, setExtraCharges] = useState<Array<{name: string; amount: number}>>([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Use invoice calculations hook
  const { subtotal, total } = useInvoiceCalculations({
    invoiceItems,
    laborCharges,
    extraCharges,
    discount,
    taxRate
  });

  // Use invoice creation hook
  const { createInvoiceObject } = useInvoiceCreation({
    selectedCustomer,
    selectedVehicle,
    invoiceItems,
    laborCharges,
    extraCharges,
    discount,
    taxRate,
    subtotal,
    total,
    notes,
    paymentMethod,
    paymentAmount,
    kilometers,
    existingInvoice
  });

  // Service and part handlers
  const addService = (serviceId: string) => {
    const service = transformedServices.find(s => s.id === serviceId);
    if (service) {
      addServiceToItems(service);
    }
  };

  const addPart = (partId: string) => {
    const part = transformedParts.find(p => p.id === partId);
    if (part) {
      addPartToItems(part);
    }
  };

  const handleSaveInvoice = (status: Invoice['status'] = 'draft') => {
    const invoice = createInvoiceObject(status);
    onSave(invoice);
    toast.success(`Invoice ${status === 'draft' ? 'saved as draft' : 'created'} successfully!`);
  };

  const handlePrintPreview = () => {
    setShowPrintPreview(true);
  };

  useEffect(() => {
    setPaymentAmount(total);
  }, [total]);

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
      <InvoiceFormData
        selectedCustomer={selectedCustomer}
        selectedVehicle={selectedVehicle}
        kilometers={kilometers}
        onCustomerChange={setSelectedCustomer}
        onVehicleChange={setSelectedVehicle}
        onKilometersChange={setKilometers}
        onCustomerAdded={setSelectedCustomer}
        invoiceItems={invoiceItems}
        onAddService={addService}
        onAddPart={addPart}
        onRemoveItem={removeItem}
        onUpdateItemQuantity={updateItemQuantity}
        onUpdateItemDiscount={updateItemDiscount}
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

      <InvoiceFormActions
        selectedCustomer={selectedCustomer}
        selectedVehicle={selectedVehicle}
        invoiceItems={invoiceItems}
        onSaveInvoice={handleSaveInvoice}
        onPrintPreview={handlePrintPreview}
        onCancel={onCancel}
      />
    </div>
  );
};

export default InvoiceForm;
