
import React from 'react';
import { Invoice } from '@/types/billing';

interface TotalsSectionProps {
  invoice: Invoice;
}

const TotalsSection = ({ invoice }: TotalsSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-8 mb-8">
      <div></div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{invoice.subtotal.toFixed(2)}</span>
        </div>
        {invoice.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({invoice.discount}%):</span>
            <span>-₹{((invoice.subtotal * invoice.discount) / 100).toFixed(2)}</span>
          </div>
        )}
        {invoice.invoiceType === 'gst' ? (
          <>
            <div className="flex justify-between">
              <span>CGST ({(invoice.taxRate / 2)}%):</span>
              <span>₹{(invoice.taxAmount / 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST ({(invoice.taxRate / 2)}%):</span>
              <span>₹{(invoice.taxAmount / 2).toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between">
            <span>Tax ({invoice.taxRate}%):</span>
            <span>₹{invoice.taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t-2 border-black pt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span>₹{invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;
