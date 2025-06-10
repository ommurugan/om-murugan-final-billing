
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/billing";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform database response to match our TypeScript interface
      return data.map((customer: any): Customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        gstNumber: customer.gst_number,
        createdAt: customer.created_at,
        totalSpent: 0, // Will be calculated from invoices when needed
        loyaltyPoints: 0, // Will be calculated when needed
        notes: customer.notes
      }));
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customer: Omit<Customer, "id" | "createdAt" | "totalSpent" | "loyaltyPoints">) => {
      // Transform the Customer interface back to database format
      const dbCustomer = {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        gst_number: customer.gstNumber
      };
      
      const { data, error } = await supabase
        .from("customers")
        .insert([dbCustomer])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
