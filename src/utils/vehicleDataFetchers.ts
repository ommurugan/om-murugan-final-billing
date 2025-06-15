
import { supabase } from "@/integrations/supabase/client";
import type { DatabaseVehicle, DatabaseInvoice, DatabaseInvoiceItem, DatabaseService, DatabasePart } from "@/types/vehicleSearch";

export const fetchVehicleWithCustomer = async (vehicleNumber: string): Promise<DatabaseVehicle | null> => {
  console.log('=== Starting Vehicle Search ===');
  console.log('Searching for vehicle:', vehicleNumber);
  
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
  return vehicle as DatabaseVehicle;
};

export const fetchInvoicesForVehicle = async (vehicleId: string): Promise<DatabaseInvoice[]> => {
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("created_at", { ascending: false });
  
  if (invoicesError) {
    console.error('Error fetching invoices:', invoicesError);
    throw invoicesError;
  }
  
  console.log(`Found ${invoices?.length || 0} invoices for vehicle`);
  return invoices || [];
};

export const fetchInvoiceItems = async (invoiceIds: string[]): Promise<DatabaseInvoiceItem[]> => {
  if (invoiceIds.length === 0) return [];
  
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
  return invoiceItems || [];
};

export const fetchServicesAndParts = async (serviceIds: string[], partIds: string[]) => {
  console.log('Service IDs to fetch:', serviceIds);
  console.log('Part IDs to fetch:', partIds);
  
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
  
  return {
    services: (servicesResponse.data || []) as DatabaseService[],
    parts: (partsResponse.data || []) as DatabasePart[]
  };
};
