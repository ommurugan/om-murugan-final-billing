
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Vehicle {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  year?: number;
  vehicle_number: string;
  vehicle_type: 'car' | 'bike' | 'scooter';
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

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Vehicle> & { id: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("vehicles")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
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

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};
