
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/billing";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (customer: Customer) => {
      if (!user) throw new Error("User not authenticated");
      
      const dbCustomer = {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        gst_number: customer.gstNumber,
      };
      
      const { data, error } = await supabase
        .from("customers")
        .update(dbCustomer)
        .eq("id", customer.id)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully!");
    },
    onError: (error) => {
      console.error("Update customer error:", error);
      toast.error("Failed to update customer");
    },
  });
};
