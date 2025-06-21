
import InvoiceViewModal from "../invoice/InvoiceViewModal";
import ProfessionalInvoicePrint from "../ProfessionalInvoicePrint";
import { InvoiceWithDetails } from "@/types/invoiceWithDetails";

interface GSTInvoiceModalsProps {
  showViewModal: boolean;
  showPrintPreview: boolean;
  selectedInvoice: InvoiceWithDetails | null;
  onCloseViewModal: () => void;
  onClosePrintPreview: () => void;
  onEditInvoice: () => void;
  onPrintInvoice: (invoice: InvoiceWithDetails) => void;
}

const GSTInvoiceModals = ({
  showViewModal,
  showPrintPreview,
  selectedInvoice,
  onCloseViewModal,
  onClosePrintPreview,
  onEditInvoice,
  onPrintInvoice
}: GSTInvoiceModalsProps) => {
  return (
    <>
      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          customer={selectedInvoice.customer}
          vehicle={selectedInvoice.vehicle}
          onClose={onCloseViewModal}
          onEdit={onEditInvoice}
          onPrint={() => onPrintInvoice(selectedInvoice)}
        />
      )}

      {/* Print Preview Modal */}
      {showPrintPreview && selectedInvoice && selectedInvoice.customer && selectedInvoice.vehicle && (
        <ProfessionalInvoicePrint
          invoice={selectedInvoice}
          customer={selectedInvoice.customer}
          vehicle={selectedInvoice.vehicle}
          onClose={onClosePrintPreview}
        />
      )}
    </>
  );
};

export default GSTInvoiceModals;
