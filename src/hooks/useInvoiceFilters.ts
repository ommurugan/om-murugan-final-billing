
import { useMemo } from "react";
import { Invoice, Customer } from "@/types/billing";
import { InvoiceWithDetails } from "@/types/invoiceWithDetails";

interface UseInvoiceFiltersProps {
  invoices: InvoiceWithDetails[];
  customers: Customer[];
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
}

export const useInvoiceFilters = ({
  invoices,
  customers,
  searchTerm,
  statusFilter,
  dateFilter
}: UseInvoiceFiltersProps) => {
  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || "Unknown Customer";
  };

  return useMemo(() => {
    return invoices.filter(invoice => {
      const customerName = invoice.customerName || getCustomerName(invoice.customerId);
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const invoiceDate = new Date(invoice.createdAt);
        const now = new Date();
        switch (dateFilter) {
          case "today":
            matchesDate = invoiceDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = invoiceDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = invoiceDate >= monthAgo;
            break;
        }
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [invoices, customers, searchTerm, statusFilter, dateFilter]);
};
