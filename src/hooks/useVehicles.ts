
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Vehicle {
  id: string;
  customer_id: string;
  vehicle_number: string;
  make: string;
  model: string;
  vehicle_type: string;
  year?: number;
  engine_number?: string;
  chassis_number?: string;
  color?: string;
  created_at: string;
  user_id?: string;
}

export const useVehicles = (customerId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["vehicles", customerId],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      let query = supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (customerId) {
        query = query.eq("customer_id", customerId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Vehicle[];
    },
    enabled: !!user,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (vehicle: Omit<Vehicle, "id" | "created_at" | "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      
      const vehicleData = {
        ...vehicle,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("vehicles")
        .insert([vehicleData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};
