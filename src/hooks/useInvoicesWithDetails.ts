
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

      // Fetch services and parts to get the actual HSN codes
      const { data: services, error: servicesError } = await supabase
        .from("services")
        .select("id, hsn_code");

      if (servicesError) {
        console.error("Error fetching services:", servicesError);
        throw servicesError;
      }

      const { data: parts, error: partsError } = await supabase
        .from("parts")
        .select("id, hsn_code");

      if (partsError) {
        console.error("Error fetching parts:", partsError);
        throw partsError;
      }

      return invoices?.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        invoiceType: invoice.invoice_type as 'gst' | 'non-gst',
        customerId: invoice.customer_id,
        vehicleId: invoice.vehicle_id,
        items: invoiceItems?.filter(item => item.invoice_id === invoice.id).map(item => {
          // Find the actual HSN code from services or parts based on item_id and type
          let actualHsnCode = '';
          
          if (item.item_type === 'service') {
            const service = services?.find(s => s.id === item.item_id);
            actualHsnCode = service?.hsn_code || '';
          } else if (item.item_type === 'part') {
            const part = parts?.find(p => p.id === item.item_id);
            actualHsnCode = part?.hsn_code || '';
          }

          // Use the actual HSN code from the service/part, fallback to stored hsn_code, then empty string
          const hsnCode = actualHsnCode || item.hsn_code || '';
          
          console.log("Retrieved item:", item.name, "with actual HSN code:", hsnCode, "from", item.item_type);
          
          return {
            id: item.id,
            type: item.item_type as 'service' | 'part',
            itemId: item.item_id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: Number(item.unit_price),
            discount: Number(item.discount),
            total: Number(item.total),
            hsnCode: hsnCode // Use the actual HSN code from the master data
          };
        }) || [],
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        taxRate: invoice.tax_rate,
        taxAmount: invoice.tax_amount,
        extraCharges: [],
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
