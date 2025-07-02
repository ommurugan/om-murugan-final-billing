
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

      // Create invoice items
      if (invoice.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(
            invoice.items.map(item => ({
              invoice_id: invoice.id,
              item_id: item.itemId,
              item_type: item.type,
              name: item.name,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              discount: item.discount,
              total: item.total,
              hsn_code: item.hsnCode
            }))
          );

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
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });
};
