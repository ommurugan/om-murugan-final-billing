
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/types/billing";
import { useAuth } from "@/hooks/useAuth";

export const useInvoices = (type?: 'gst' | 'non-gst') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["invoices", type],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      let query = supabase
        .from("invoices")
        .select(`
          *,
          customers(id, name, phone, email, gst_number),
          vehicles(id, make, model, vehicle_number, vehicle_type, customer_id),
          invoice_items(id, name, item_type, quantity, unit_price, discount, total)
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
        items: invoice.invoice_items?.map((item: any) => ({
          id: item.id,
          type: item.item_type,
          itemId: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          discount: item.discount,
          total: item.total
        })) || [],
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
    enabled: !!user,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (invoice: Omit<Invoice, "id" | "createdAt">) => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Creating invoice with data:", invoice);
      
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
        kilometers: invoice.kilometers,
        user_id: user.id
      };
      
      console.log("Transformed invoice data for database:", dbInvoice);
      
      const { data, error } = await supabase
        .from("invoices")
        .insert([dbInvoice])
        .select()
        .single();
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      // Also insert invoice items if they exist
      if (invoice.items && invoice.items.length > 0) {
        const invoiceItems = invoice.items.map(item => ({
          invoice_id: data.id,
          item_id: item.itemId,
          name: item.name,
          item_type: item.type,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          discount: item.discount,
          total: item.total
        }));

        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(invoiceItems);

        if (itemsError) {
          console.error("Error inserting invoice items:", itemsError);
          throw itemsError;
        }
      }
      
      console.log("Invoice created successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Deleting invoice with ID:", invoiceId);
      
      // First delete invoice items
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", invoiceId);

      if (itemsError) {
        console.error("Error deleting invoice items:", itemsError);
        throw itemsError;
      }

      // Then delete the invoice
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", invoiceId);
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Invoice deleted successfully");
      return invoiceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices-with-details"] });
    },
  });
};
