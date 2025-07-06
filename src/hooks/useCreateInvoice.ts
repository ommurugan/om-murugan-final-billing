
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/types/billing";

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: Invoice) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create the invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          id: invoice.id,
          invoice_number: invoice.invoiceNumber,
          invoice_type: invoice.invoiceType,
          customer_id: invoice.customerId,
          vehicle_id: invoice.vehicleId,
          subtotal: invoice.subtotal,
          discount: invoice.discount,
          tax_rate: invoice.taxRate,
          tax_amount: invoice.taxAmount,
          total: invoice.total,
          status: invoice.status,
          due_date: invoice.dueDate,
          paid_at: invoice.paidAt,
          notes: invoice.notes,
          labor_charges: invoice.laborCharges,
          kilometers: invoice.kilometers,
          user_id: user.id
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items with proper HSN code handling
      if (invoice.items.length > 0) {
        // Fetch the actual HSN codes from services and parts tables
        const serviceIds = invoice.items.filter(item => item.type === 'service').map(item => item.itemId);
        const partIds = invoice.items.filter(item => item.type === 'part').map(item => item.itemId);

        let services = [];
        let parts = [];

        if (serviceIds.length > 0) {
          const { data: servicesData } = await supabase
            .from('services')
            .select('id, hsn_code')
            .in('id', serviceIds);
          services = servicesData || [];
        }

        if (partIds.length > 0) {
          const { data: partsData } = await supabase
            .from('parts')
            .select('id, hsn_code')
            .in('id', partIds);
          parts = partsData || [];
        }

        const itemsToInsert = invoice.items.map(item => {
          // Get the actual HSN code from the master data
          let actualHsnCode = '';
          
          if (item.type === 'service') {
            const service = services.find(s => s.id === item.itemId);
            actualHsnCode = service?.hsn_code || '';
          } else if (item.type === 'part') {
            const part = parts.find(p => p.id === item.itemId);
            actualHsnCode = part?.hsn_code || '';
          }

          const hsnCodeToSave = actualHsnCode || item.hsnCode || '';
          
          console.log("Saving item:", item.name, "with HSN code:", hsnCodeToSave, "from", item.type);
          
          return {
            invoice_id: invoice.id,
            item_id: item.itemId,
            item_type: item.type,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            discount: item.discount,
            total: item.total,
            hsn_code: hsnCodeToSave // Save the actual HSN code from master data
          };
        });

        console.log("Items to insert with HSN codes:", itemsToInsert);

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      // Create payments if any
      if (invoice.payments.length > 0) {
        const { error: paymentsError } = await supabase
          .from('payments')
          .insert(
            invoice.payments.map(payment => ({
              invoice_id: invoice.id,
              amount: payment.amount,
              method: payment.method,
              status: payment.status,
              transaction_id: payment.transactionId,
              paid_at: payment.paidAt,
              refund_amount: payment.refundAmount,
              refund_reason: payment.refundReason
            }))
          );

        if (paymentsError) throw paymentsError;
      }

      return invoiceData;
    },
    onSuccess: () => {
      // Invalidate all invoice-related queries to ensure lists update
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices-with-details'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'gst'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'non-gst'] });
    }
  });
};
