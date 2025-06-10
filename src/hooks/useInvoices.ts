import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/types/billing";

export const useInvoices = (type?: 'gst' | 'non-gst') => {
  return useQuery({
    queryKey: ["invoices", type],
    queryFn: async () => {
      let query = supabase
        .from("invoices")
        .select(`
          *,
          customers(name, phone, email, gst_number),
          vehicles(make, model, vehicle_number)
        `)
        .order("created_at", { ascending: false });
      
      if (type) {
        query = query.eq("invoice_type", type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform database response to match our TypeScript interface
      return data.map((invoice: any): Invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        invoiceType: invoice.invoice_type,
        customerId: invoice.customer_id,
        vehicleId: invoice.vehicle_id,
        items: [], // Will be populated separately when needed
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        taxRate: invoice.tax_rate,
        taxAmount: invoice.tax_amount,
        extraCharges: [], // Will be populated separately when needed
        total: invoice.total,
        status: invoice.status,
        createdAt: invoice.created_at,
        dueDate: invoice.due_date,
        paidAt: invoice.paid_at,
        notes: invoice.notes,
        laborCharges: invoice.labor_charges,
        payments: [], // Will be populated separately when needed
        kilometers: invoice.kilometers
      }));
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoice: Omit<Invoice, "id" | "createdAt">) => {
      // Transform the Invoice interface back to database format
      const dbInvoice = {
        invoice_number: invoice.invoiceNumber,
        invoice_type: invoice.invoiceType,
        customer_id: invoice.customerId,
        vehicle_id: invoice.vehicleId,
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        tax_rate: invoice.taxRate,
        tax_amount: invoice.taxAmount,
        total: invoice.total,
        status: invoice.status,
        due_date: invoice.dueDate,
        paid_at: invoice.paidAt,
        notes: invoice.notes,
        labor_charges: invoice.laborCharges,
        kilometers: invoice.kilometers
      };
      
      const { data, error } = await supabase
        .from("invoices")
        .insert([dbInvoice])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};
