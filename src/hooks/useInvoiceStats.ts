
import { useMemo } from "react";
import { Invoice } from "@/types/billing";

export const useInvoiceStats = (invoices: Invoice[]) => {
  return useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
  }), [invoices]);
};
