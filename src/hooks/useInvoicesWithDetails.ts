
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

      return invoices?.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        invoiceType: invoice.invoice_type as 'gst' | 'non-gst',
        customerId: invoice.customer_id,
        vehicleId: invoice.vehicle_id,
        items: [], // We'll fetch these separately if needed
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
