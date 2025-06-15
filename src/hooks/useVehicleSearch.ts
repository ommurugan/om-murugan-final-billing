
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useVehicleSearch = (vehicleNumber: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["vehicle-search", vehicleNumber],
    queryFn: async () => {
      if (!user || !vehicleNumber.trim()) return null;
      
      // First, find the vehicle
      const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .ilike("vehicle_number", `%${vehicleNumber.trim()}%`)
        .single();
      
      if (vehicleError || !vehicle) return null;
      
      // Then find all invoices for this vehicle with detailed information
      const { data: invoices, error: invoicesError } = await supabase
        .from("invoices")
        .select(`
          *,
          customers(name, phone, email),
          vehicles(make, model, vehicle_number),
          invoice_items(
            *,
            services(name, category),
            parts(name, category, part_number)
          )
        `)
        .eq("vehicle_id", vehicle.id)
        .order("created_at", { ascending: false });
      
      if (invoicesError) throw invoicesError;
      
      return {
        vehicle,
        serviceHistory: invoices || []
      };
    },
    enabled: !!user && !!vehicleNumber.trim(),
  });
};
