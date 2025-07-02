
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useInvoicesWithDetails = () => {
  return useQuery({
    queryKey: ["invoices-with-details"],
    queryFn: async () => {
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customers (
            id,
            name,
            phone,
            email,
            gst_number
          ),
          vehicles (
            id,
            make,
            model,
            vehicle_number,
            vehicle_type,
            year,
            color
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching invoices with details:", error);
        throw error;
      }

      // Fetch invoice items for all invoices
      const invoiceIds = invoices?.map(inv => inv.id) || [];
      const { data: invoiceItems, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .in("invoice_id", invoiceIds);

      if (itemsError) {
        console.error("Error fetching invoice items:", itemsError);
        throw itemsError;
      }

      // Get unique service and part IDs
      const serviceIds = invoiceItems?.filter(item => item.item_type === 'service').map(item => item.item_id) || [];
      const partIds = invoiceItems?.filter(item => item.item_type === 'part').map(item => item.item_id) || [];

      // Fetch services and parts data
      const [servicesResponse, partsResponse] = await Promise.all([
        serviceIds.length > 0 
          ? supabase.from("services").select("id, name, category").in("id", serviceIds)
          : Promise.resolve({ data: [], error: null }),
        partIds.length > 0
          ? supabase.from("parts").select("id, name, category, part_number").in("id", partIds)
          : Promise.resolve({ data: [], error: null })
      ]);

      if (servicesResponse.error) {
        console.error("Error fetching services:", servicesResponse.error);
      }

      if (partsResponse.error) {
        console.error("Error fetching parts:", partsResponse.error);
      }

      const servicesMap = new Map((servicesResponse.data || []).map(s => [s.id, s]));
      const partsMap = new Map((partsResponse.data || []).map(p => [p.id, p]));

      return invoices?.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        invoiceType: invoice.invoice_type as 'gst' | 'non-gst',
        customerId: invoice.customer_id,
        vehicleId: invoice.vehicle_id,
        items: invoiceItems?.filter(item => item.invoice_id === invoice.id).map(item => {
          return {
            id: item.id,
            type: item.item_type as 'service' | 'part',
            itemId: item.item_id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: Number(item.unit_price),
            discount: Number(item.discount),
            total: Number(item.total),
            hsnCode: item.hsn_code || undefined
          };
        }) || [],
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        taxRate: invoice.tax_rate,
        taxAmount: invoice.tax_amount,
        extraCharges: [], // We'll need to handle this separately if needed
        total: invoice.total,
        status: invoice.status as any,
        createdAt: invoice.created_at,
        dueDate: invoice.due_date || '',
        paidAt: invoice.paid_at,
        notes: invoice.notes,
        laborCharges: invoice.labor_charges,
        payments: [],
        kilometers: invoice.kilometers,
        customer: invoice.customers ? {
          id: invoice.customers.id,
          name: invoice.customers.name,
          phone: invoice.customers.phone,
          email: invoice.customers.email || '',
          gstNumber: invoice.customers.gst_number || '',
          createdAt: '',
          totalSpent: 0,
          loyaltyPoints: 0
        } : null,
        vehicle: invoice.vehicles ? {
          id: invoice.vehicles.id,
          customerId: invoice.customer_id,
          make: invoice.vehicles.make,
          model: invoice.vehicles.model,
          year: invoice.vehicles.year,
          vehicleNumber: invoice.vehicles.vehicle_number,
          vehicleType: invoice.vehicles.vehicle_type as 'car' | 'bike' | 'scooter',
          color: invoice.vehicles.color,
          createdAt: ''
        } : null
      })) || [];
    },
  });
};
