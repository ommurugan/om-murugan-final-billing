
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Customer, Vehicle, Invoice, Payment } from "@/types/billing";
import InvoicePrintPreview from "../InvoicePrintPreview";
import CustomerQuickAdd from "../CustomerQuickAdd";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useServices } from "@/hooks/useServices";
import { useParts } from "@/hooks/useParts";
import { useInvoiceCalculations } from "@/hooks/useInvoiceCalculations";
import { useInvoiceOperations } from "@/hooks/useInvoiceOperations";
import { useDataTransformations } from "@/hooks/useDataTransformations";
import { useInvoiceCreation } from "@/hooks/useInvoiceCreation";
import CustomerVehicleSelection from "./CustomerVehicleSelection";
import ServicesPartsSelection from "./ServicesPartsSelection";
import AdditionalCharges from "./AdditionalCharges";
import PaymentSummary from "./PaymentSummary";
import InvoiceActionButtons from "./InvoiceActionButtons";

interface InvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  existingInvoice?: Invoice;
}

const InvoiceForm = ({ onSave, onCancel, existingInvoice }: InvoiceFormProps) => {
  const { data: customersData = [] } = useCustomers();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [kilometers, setKilometers] = useState(0);

  // Fetch vehicles for the selected customer
  const { data: vehiclesData = [] } = useVehicles(selectedCustomer?.id);
  
  // Fetch services and parts
  const { data: servicesData = [] } = useServices();
  const { data: partsData = [] } = useParts();

  console.log("Services data:", servicesData);
  console.log("Parts data:", partsData);
  console.log("Vehicles data:", vehiclesData);
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

  const { transformedVehicles, transformedServices, transformedParts } = useDataTransformations({
    vehiclesData,
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

  // Update customers when data changes
  useEffect(() => {
    setCustomers(customersData);
  }, [customersData]);

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

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    setSelectedCustomer(newCustomer);
  };

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
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part");
      return;
    }

    const invoice = createInvoiceObject(status);
    onSave(invoice);
    toast.success(`Invoice ${status === 'draft' ? 'saved as draft' : 'created'} successfully!`);
  };

  const handlePrintPreview = () => {
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part to preview");
      return;
    }
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
      <CustomerVehicleSelection
        customers={customers}
        selectedCustomer={selectedCustomer}
        selectedVehicle={selectedVehicle}
        vehicles={transformedVehicles}
        kilometers={kilometers}
        onCustomerChange={setSelectedCustomer}
        onVehicleChange={setSelectedVehicle}
        onKilometersChange={setKilometers}
        onCustomerAdded={handleCustomerAdded}
        CustomerQuickAddComponent={CustomerQuickAdd}
      />

      <ServicesPartsSelection
        services={transformedServices}
        parts={transformedParts}
        invoiceItems={invoiceItems}
        onAddService={addService}
        onAddPart={addPart}
        onRemoveItem={removeItem}
        onUpdateItemQuantity={updateItemQuantity}
        onUpdateItemDiscount={updateItemDiscount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdditionalCharges
          laborCharges={laborCharges}
          extraCharges={extraCharges}
          discount={discount}
          taxRate={taxRate}
          notes={notes}
          onLaborChargesChange={setLaborCharges}
          onExtraChargesChange={setExtraCharges}
          onDiscountChange={setDiscount}
          onTaxRateChange={setTaxRate}
          onNotesChange={setNotes}
        />

        <PaymentSummary
          subtotal={subtotal}
          discount={discount}
          taxRate={taxRate}
          total={total}
          paymentMethod={paymentMethod}
          paymentAmount={paymentAmount}
          onPaymentMethodChange={setPaymentMethod}
          onPaymentAmountChange={setPaymentAmount}
        />
      </div>

      <InvoiceActionButtons
        onSaveDraft={() => handleSaveInvoice('draft')}
        onCreateInvoice={() => handleSaveInvoice('sent')}
        onPrintPreview={handlePrintPreview}
        onCancel={onCancel}
      />
    </div>
  );
};

export default InvoiceForm;
