
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (customerId: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete customer error:", error);
      toast.error("Failed to delete customer");
    },
  });
};
