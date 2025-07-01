
import React from 'react';
import { Invoice, Customer } from '@/types/billing';

interface InvoiceDetailsProps {
  invoice: Invoice;
  customer: Customer;
}

const InvoiceDetails = ({ invoice, customer }: InvoiceDetailsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="grid grid-cols-2 gap-8 mb-6">
      <div>
        <h2 className="text-xl font-bold mb-3">BILL TO:</h2>
        <div className="space-y-1">
          <p className="font-semibold">{customer.name}</p>
          <p>{customer.phone}</p>
          <p>{customer.email}</p>
          {customer.gstNumber && (
            <p><strong>GST No:</strong> {customer.gstNumber}</p>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="space-y-2">
          <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Date:</strong> {formatDate(invoice.createdAt)}</p>
          <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
          <p><strong>Invoice Type:</strong> {invoice.invoiceType === 'gst' ? 'GST Invoice' : 'Non-GST Invoice'}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
