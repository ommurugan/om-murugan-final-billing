
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useVehicleSearch = (vehicleNumber: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["vehicle-search", vehicleNumber],
    queryFn: async () => {
      if (!user || !vehicleNumber.trim()) return null;
      
      console.log('=== Starting Vehicle Search ===');
      console.log('Searching for vehicle:', vehicleNumber);
      
      // First, find the vehicle with customer information
      const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .select(`
          *,
          customers (
            id,
            name,
            phone,
            email
          )
        `)
        .ilike("vehicle_number", `%${vehicleNumber.trim()}%`)
        .single();
      
      if (vehicleError || !vehicle) {
        console.log('Vehicle not found:', vehicleError);
        return null;
      }
      
      console.log('Found vehicle with customer:', vehicle);
      
      // Then find all invoices for this vehicle
      const { data: invoices, error: invoicesError } = await supabase
        .from("invoices")
        .select("*")
        .eq("vehicle_id", vehicle.id)
        .order("created_at", { ascending: false });
      
      if (invoicesError) {
        console.error('Error fetching invoices:', invoicesError);
        throw invoicesError;
      }
      
      console.log(`Found ${invoices?.length || 0} invoices for vehicle`);
      
      if (!invoices || invoices.length === 0) {
        console.log('No invoices found - returning vehicle with empty service history');
        return {
          vehicle: {
            vehicle_number: vehicle.vehicle_number,
            make: vehicle.make,
            model: vehicle.model,
            vehicle_type: vehicle.vehicle_type,
            year: vehicle.year,
            color: vehicle.color
          },
          vehicleOwner: vehicle.customers ? {
            name: vehicle.customers.name,
            phone: vehicle.customers.phone || undefined,
            email: vehicle.customers.email || undefined
          } : null,
          serviceHistory: []
        };
      }
      
      // Fetch invoice items for all invoices
      const invoiceIds = invoices.map(invoice => invoice.id);
      console.log('Fetching items for invoice IDs:', invoiceIds);
      
      const { data: invoiceItems, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .in("invoice_id", invoiceIds);
      
      if (itemsError) {
        console.error('Error fetching invoice items:', itemsError);
        throw itemsError;
      }
      
      console.log(`Found ${invoiceItems?.length || 0} invoice items`);
      
      // Get unique service and part IDs if items exist
      let servicesMap = new Map();
      let partsMap = new Map();
      
      if (invoiceItems && invoiceItems.length > 0) {
        const serviceIds = [...new Set(
          invoiceItems
            .filter(item => item.item_type === 'service')
            .map(item => item.item_id)
        )];
        
        const partIds = [...new Set(
          invoiceItems
            .filter(item => item.item_type === 'part')
            .map(item => item.item_id)
        )];
        
        console.log('Service IDs to fetch:', serviceIds);
        console.log('Part IDs to fetch:', partIds);
        
        // Fetch services and parts data in parallel
        const [servicesResponse, partsResponse] = await Promise.all([
          serviceIds.length > 0 
            ? supabase.from("services").select("id, name, category").in("id", serviceIds)
            : Promise.resolve({ data: [], error: null }),
          partIds.length > 0
            ? supabase.from("parts").select("id, name, category, part_number").in("id", partIds)
            : Promise.resolve({ data: [], error: null })
        ]);
        
        if (servicesResponse.error) {
          console.error('Error fetching services:', servicesResponse.error);
          throw servicesResponse.error;
        }
        
        if (partsResponse.error) {
          console.error('Error fetching parts:', partsResponse.error);
          throw partsResponse.error;
        }
        
        console.log('Services data:', servicesResponse.data);
        console.log('Parts data:', partsResponse.data);
        
        // Create lookup maps
        servicesMap = new Map(
          (servicesResponse.data || []).map(service => [service.id, service])
        );
        partsMap = new Map(
          (partsResponse.data || []).map(part => [part.id, part])
        );
      }
      
      // Transform invoices with enriched item data
      const enrichedInvoices = invoices.map(invoice => {
        const invoiceItemsForInvoice = invoiceItems?.filter(item => item.invoice_id === invoice.id) || [];
        
        console.log(`Processing invoice ${invoice.invoice_number} with ${invoiceItemsForInvoice.length} items`);
        
        const transformedItems = invoiceItemsForInvoice.map(item => {
          const baseItem = {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            item_type: item.item_type
          };
          
          if (item.item_type === 'service') {
            const serviceData = servicesMap.get(item.item_id);
            return {
              ...baseItem,
              services: serviceData || { name: item.name, category: 'Unknown' },
              parts: undefined
            };
          } else if (item.item_type === 'part') {
            const partData = partsMap.get(item.item_id);
            return {
              ...baseItem,
              services: undefined,
              parts: partData || { name: item.name, category: 'Unknown', part_number: null }
            };
          }
          
          return baseItem;
        });
        
        return {
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          created_at: invoice.created_at,
          total: invoice.total,
          status: invoice.status,
          customers: vehicle.customers ? {
            name: vehicle.customers.name,
            phone: vehicle.customers.phone || undefined,
            email: vehicle.customers.email || undefined
          } : undefined,
          kilometers: invoice.kilometers || undefined,
          invoice_items: transformedItems
        };
      });
      
      console.log('=== Final Result ===');
      console.log('Vehicle owner:', vehicle.customers);
      console.log('Service history count:', enrichedInvoices.length);
      console.log('First invoice items:', enrichedInvoices[0]?.invoice_items);
      
      return {
        vehicle: {
          vehicle_number: vehicle.vehicle_number,
          make: vehicle.make,
          model: vehicle.model,
          vehicle_type: vehicle.vehicle_type,
          year: vehicle.year,
          color: vehicle.color
        },
        vehicleOwner: vehicle.customers ? {
          name: vehicle.customers.name,
          phone: vehicle.customers.phone || undefined,
          email: vehicle.customers.email || undefined
        } : null,
        serviceHistory: enrichedInvoices
      };
    },
    enabled: !!user && !!vehicleNumber.trim(),
  });
};
