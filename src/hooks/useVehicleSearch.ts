
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
      
      // Then find all invoices for this vehicle with basic information
      const { data: invoices, error: invoicesError } = await supabase
        .from("invoices")
        .select(`
          *,
          customers(name, phone, email),
          vehicles(make, model, vehicle_number)
        `)
        .eq("vehicle_id", vehicle.id)
        .order("created_at", { ascending: false });
      
      if (invoicesError) throw invoicesError;
      
      if (!invoices || invoices.length === 0) {
        return {
          vehicle,
          serviceHistory: []
        };
      }
      
      // Fetch invoice items for all invoices
      const invoiceIds = invoices.map(invoice => invoice.id);
      const { data: invoiceItems, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .in("invoice_id", invoiceIds);
      
      if (itemsError) throw itemsError;
      
      // Fetch services and parts separately
      const serviceIds = invoiceItems?.filter(item => item.item_type === 'service').map(item => item.item_id) || [];
      const partIds = invoiceItems?.filter(item => item.item_type === 'part').map(item => item.item_id) || [];
      
      const [servicesData, partsData] = await Promise.all([
        serviceIds.length > 0 
          ? supabase.from("services").select("id, name, category").in("id", serviceIds)
          : { data: [], error: null },
        partIds.length > 0
          ? supabase.from("parts").select("id, name, category, part_number").in("id", partIds)
          : { data: [], error: null }
      ]);
      
      if (servicesData.error) throw servicesData.error;
      if (partsData.error) throw partsData.error;
      
      // Create lookup maps with proper type handling
      const servicesMap = new Map(
        (servicesData.data || []).map(service => [service.id, service] as [string, any])
      );
      const partsMap = new Map(
        (partsData.data || []).map(part => [part.id, part] as [string, any])
      );
      
      // Transform the data to match the expected interface
      const enrichedInvoices = invoices.map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        created_at: invoice.created_at,
        total: invoice.total,
        status: invoice.status,
        customers: invoice.customers ? {
          name: invoice.customers.name,
          phone: invoice.customers.phone || undefined,
          email: invoice.customers.email || undefined
        } : undefined,
        kilometers: invoice.kilometers || undefined,
        invoice_items: invoiceItems
          ?.filter(item => item.invoice_id === invoice.id)
          ?.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            item_type: item.item_type,
            services: item.item_type === 'service' ? servicesMap.get(item.item_id) : undefined,
            parts: item.item_type === 'part' ? partsMap.get(item.item_id) : undefined
          })) || undefined
      }));
      
      return {
        vehicle,
        serviceHistory: enrichedInvoices
      };
    },
    enabled: !!user && !!vehicleNumber.trim(),
  });
};
