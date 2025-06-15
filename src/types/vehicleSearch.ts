
export interface VehicleSearchResult {
  vehicle: {
    vehicle_number: string;
    make: string;
    model: string;
    vehicle_type: string;
    year?: number;
    color?: string;
  };
  vehicleOwner: {
    name: string;
    phone?: string;
    email?: string;
  } | null;
  serviceHistory: Array<{
    id: string;
    invoice_number: string;
    created_at: string;
    total: number;
    status: string;
    customers?: {
      name: string;
      phone?: string;
      email?: string;
    };
    kilometers?: number;
    invoice_items?: Array<{
      id: string;
      name: string;
      quantity: number;
      unit_price: number;
      total: number;
      item_type: string;
      services?: {
        name: string;
        category: string;
      };
      parts?: {
        name: string;
        category: string;
        part_number?: string;
      };
    }>;
  }>;
}

export interface DatabaseVehicle {
  id: string;
  vehicle_number: string;
  make: string;
  model: string;
  vehicle_type: string;
  year?: number;
  color?: string;
  customers?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
}

export interface DatabaseInvoice {
  id: string;
  invoice_number: string;
  created_at: string;
  total: number;
  status: string;
  kilometers?: number;
}

export interface DatabaseInvoiceItem {
  id: string;
  invoice_id: string;
  item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
  item_type: string;
}

export interface DatabaseService {
  id: string;
  name: string;
  category: string;
}

export interface DatabasePart {
  id: string;
  name: string;
  category: string;
  part_number?: string;
}
