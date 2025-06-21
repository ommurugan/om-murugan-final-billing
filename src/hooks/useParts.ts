
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Part {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  min_stock_level: number;
  supplier?: string;
  part_number?: string;
  hsn_code?: string;
  is_active: boolean;
  created_at: string;
  user_id?: string;
}

export const useParts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["parts"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Part[];
    },
    enabled: !!user,
  });
};

export const useCreatePart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (part: Omit<Part, "id" | "created_at" | "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      
      const partData = {
        ...part,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("parts")
        .insert([partData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });
};

export const useUpdatePart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Part> & { id: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("parts")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });
};

export const useDeletePart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("parts")
        .update({ is_active: false })
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });
};
