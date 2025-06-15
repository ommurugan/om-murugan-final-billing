
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { VehicleSearchResult } from "@/types/vehicleSearch";
import { 
  fetchVehicleWithCustomer, 
  fetchInvoicesForVehicle, 
  fetchInvoiceItems, 
  fetchServicesAndParts 
} from "@/utils/vehicleDataFetchers";
import { 
  transformVehicleData, 
  transformVehicleOwnerData, 
  createLookupMaps, 
  transformInvoiceData 
} from "@/utils/vehicleDataTransformers";

export const useVehicleSearch = (vehicleNumber: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["vehicle-search", vehicleNumber],
    queryFn: async (): Promise<VehicleSearchResult | null> => {
      if (!user || !vehicleNumber.trim()) return null;
      
      // Fetch vehicle with customer information
      const vehicle = await fetchVehicleWithCustomer(vehicleNumber);
      if (!vehicle) return null;
      
      // Fetch invoices for this vehicle
      const invoices = await fetchInvoicesForVehicle(vehicle.id);
      
      if (invoices.length === 0) {
        console.log('No invoices found - returning vehicle with empty service history');
        return {
          vehicle: transformVehicleData(vehicle),
          vehicleOwner: transformVehicleOwnerData(vehicle),
          serviceHistory: []
        };
      }
      
      // Fetch invoice items
      const invoiceIds = invoices.map(invoice => invoice.id);
      const invoiceItems = await fetchInvoiceItems(invoiceIds);
      
      if (invoiceItems.length === 0) {
        return {
          vehicle: transformVehicleData(vehicle),
          vehicleOwner: transformVehicleOwnerData(vehicle),
          serviceHistory: []
        };
      }
      
      // Extract unique service and part IDs
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
      
      // Fetch services and parts data
      const { services, parts } = await fetchServicesAndParts(serviceIds, partIds);
      const { servicesMap, partsMap } = createLookupMaps(services, parts);
      
      // Transform and return final result
      const serviceHistory = transformInvoiceData(invoices, invoiceItems, vehicle, servicesMap, partsMap);
      
      console.log('=== Final Result ===');
      console.log('Vehicle owner:', vehicle.customers);
      console.log('Service history count:', serviceHistory.length);
      console.log('First invoice items:', serviceHistory[0]?.invoice_items);
      
      return {
        vehicle: transformVehicleData(vehicle),
        vehicleOwner: transformVehicleOwnerData(vehicle),
        serviceHistory
      };
    },
    enabled: !!user && !!vehicleNumber.trim(),
  });
};
