
import InvoiceViewModal from "../invoice/InvoiceViewModal";
import InvoicePrintPreview from "../InvoicePrintPreview";

interface NonGSTInvoiceModalsProps {
  showViewModal: boolean;
  showPrintPreview: boolean;
  selectedInvoice: any;
  onCloseViewModal: () => void;
  onClosePrintPreview: () => void;
  onEditInvoice: (invoice: any) => void;
  onPrintInvoice: (invoice: any) => void;
}

const NonGSTInvoiceModals = ({
  showViewModal,
  showPrintPreview,
  selectedInvoice,
  onCloseViewModal,
  onClosePrintPreview,
  onEditInvoice,
  onPrintInvoice
}: NonGSTInvoiceModalsProps) => {
  return (
    <>
      {showViewModal && selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          customer={selectedInvoice.customer}
          vehicle={selectedInvoice.vehicle}
          onClose={onCloseViewModal}
          onEdit={() => {
            onCloseViewModal();
            onEditInvoice(selectedInvoice);
          }}
          onPrint={() => {
            onCloseViewModal();
            onPrintInvoice(selectedInvoice);
          }}
        />
      )}

      {showPrintPreview && selectedInvoice && (
        <InvoicePrintPreview
          invoice={selectedInvoice}
          customer={selectedInvoice.customer}
          vehicle={selectedInvoice.vehicle}
          onClose={onClosePrintPreview}
        />
      )}
    </>
  );
};

export default NonGSTInvoiceModals;
