
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInvoicesWithDetails } from "./useInvoicesWithDetails";
import { InvoiceWithDetails } from "@/types/invoiceWithDetails";

export const useGSTInvoiceNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: invoices = [] } = useInvoicesWithDetails();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithDetails | null>(null);

  const editId = searchParams.get('edit');
  const type = searchParams.get('type');

  useEffect(() => {
    if (editId && type === 'gst') {
      const invoice = invoices.find(inv => inv.id === editId && inv.invoiceType === 'gst');
      if (invoice) {
        // Transform to proper InvoiceWithDetails format
        const transformedInvoice: InvoiceWithDetails = {
          ...invoice,
          customerName: invoice.customer?.name || '',
          customerGST: invoice.customer?.gstNumber || '',
          vehicleInfo: invoice.vehicle ? `${invoice.vehicle.make} ${invoice.vehicle.model} (${invoice.vehicle.vehicleNumber})` : ''
        };
        setSelectedInvoice(transformedInvoice);
      }
    } else {
      setSelectedInvoice(null);
    }
  }, [editId, type, invoices]);

  const clearEdit = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('edit');
    params.delete('type');
    setSearchParams(params);
    setSelectedInvoice(null);
  };

  const navigateToEdit = (invoiceId: string, invoiceType: 'gst' | 'non-gst') => {
    setSearchParams({ edit: invoiceId, type: invoiceType });
  };

  return {
    selectedInvoice,
    isEditing: !!editId && type === 'gst',
    clearEdit,
    navigateToEdit
  };
};
