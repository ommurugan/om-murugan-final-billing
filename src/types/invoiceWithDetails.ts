
import { Invoice, Customer, Vehicle } from "@/types/billing";

export type InvoiceWithDetails = Invoice & {
  customer: Customer | null;
  vehicle: Vehicle | null;
  customerName: string;
  customerGST: string;
  vehicleInfo: string;
};
