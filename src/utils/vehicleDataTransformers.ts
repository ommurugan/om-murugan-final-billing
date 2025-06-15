
import type { 
  VehicleSearchResult, 
  DatabaseVehicle, 
  DatabaseInvoice, 
  DatabaseInvoiceItem, 
  DatabaseService, 
  DatabasePart 
} from "@/types/vehicleSearch";

export const transformVehicleData = (vehicle: DatabaseVehicle): VehicleSearchResult['vehicle'] => ({
  vehicle_number: vehicle.vehicle_number,
  make: vehicle.make,
  model: vehicle.model,
  vehicle_type: vehicle.vehicle_type,
  year: vehicle.year,
  color: vehicle.color
});

export const transformVehicleOwnerData = (vehicle: DatabaseVehicle): VehicleSearchResult['vehicleOwner'] => {
  if (!vehicle.customers) return null;
  
  return {
    name: vehicle.customers.name,
    phone: vehicle.customers.phone || undefined,
    email: vehicle.customers.email || undefined
  };
};

export const createLookupMaps = (services: DatabaseService[], parts: DatabasePart[]) => {
  const servicesMap = new Map(services.map(service => [service.id, service]));
  const partsMap = new Map(parts.map(part => [part.id, part]));
  
  return { servicesMap, partsMap };
};

export const transformInvoiceItems = (
  items: DatabaseInvoiceItem[], 
  servicesMap: Map<string, DatabaseService>, 
  partsMap: Map<string, DatabasePart>
) => {
  return items.map(item => {
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
};

export const transformInvoiceData = (
  invoices: DatabaseInvoice[],
  invoiceItems: DatabaseInvoiceItem[],
  vehicle: DatabaseVehicle,
  servicesMap: Map<string, DatabaseService>,
  partsMap: Map<string, DatabasePart>
): VehicleSearchResult['serviceHistory'] => {
  return invoices.map(invoice => {
    const invoiceItemsForInvoice = invoiceItems.filter(item => item.invoice_id === invoice.id);
    
    console.log(`Processing invoice ${invoice.invoice_number} with ${invoiceItemsForInvoice.length} items`);
    
    const transformedItems = transformInvoiceItems(invoiceItemsForInvoice, servicesMap, partsMap);
    
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
};
