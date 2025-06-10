
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
      return data as Invoice[];
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoice: Omit<Invoice, "id" | "createdAt">) => {
      const { data, error } = await supabase
        .from("invoices")
        .insert([invoice])
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
