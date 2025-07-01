
import React from 'react';
import { Invoice, Customer, Vehicle } from '@/types/billing';
import PrintControls from './invoice-print/PrintControls';
import PrintHeader from './invoice-print/PrintHeader';
import InvoiceDetails from './invoice-print/InvoiceDetails';
import VehicleDetails from './invoice-print/VehicleDetails';
import ItemsTable from './invoice-print/ItemsTable';
import TotalsSection from './invoice-print/TotalsSection';
import TermsAndSignature from './invoice-print/TermsAndSignature';
import PrintStyles from './invoice-print/PrintStyles';

interface InvoicePrintPreviewProps {
  invoice: Invoice;
  customer: Customer;
  vehicle: Vehicle;
  onClose: () => void;
}

const InvoicePrintPreview = ({ invoice, customer, vehicle, onClose }: InvoicePrintPreviewProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <PrintControls onPrint={handlePrint} onClose={onClose} />

      {/* Invoice content - this will be printed */}
      <div className="print-content max-w-4xl mx-auto p-8 print:p-4 print:max-w-none print:mx-0">
        <PrintHeader />
        <InvoiceDetails invoice={invoice} customer={customer} />
        <VehicleDetails invoice={invoice} vehicle={vehicle} />
        <ItemsTable invoice={invoice} />
        <TotalsSection invoice={invoice} />
        <TermsAndSignature invoice={invoice} />
      </div>

      <PrintStyles />
    </div>
  );
};

export default InvoicePrintPreview;
