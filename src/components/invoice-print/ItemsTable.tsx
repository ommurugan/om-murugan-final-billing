
import React from 'react';
import { Invoice } from '@/types/billing';

interface ItemsTableProps {
  invoice: Invoice;
}

const ItemsTable = ({ invoice }: ItemsTableProps) => {
  const getHsnSacCode = (item: any) => {
    console.log("Item data for HSN/SAC:", item); // Debug log to see what data we have
    
    // Return the actual HSN/SAC code entered by the user, or empty string if not available
    const code = item.hsnCode || item.hsn_code;
    return code || '';
  };

  return (
    <div className="mb-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-2 border-black p-3 text-left font-bold">Description</th>
            <th className="border-2 border-black p-3 text-center font-bold">HSN/SAC Code</th>
            <th className="border-2 border-black p-3 text-center font-bold">Qty</th>
            <th className="border-2 border-black p-3 text-right font-bold">Rate</th>
            <th className="border-2 border-black p-3 text-right font-bold">Discount</th>
            <th className="border-2 border-black p-3 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="border-l-2 border-r-2 border-black p-3">
                {item.name}
                <div className="text-sm text-gray-600 capitalize">({item.type})</div>
              </td>
              <td className="border-l-2 border-r-2 border-black p-3 text-center">
                {getHsnSacCode(item)}
              </td>
              <td className="border-l-2 border-r-2 border-black p-3 text-center">{item.quantity}</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹{item.unitPrice.toFixed(2)}</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹{item.discount.toFixed(2)}</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
          {invoice.laborCharges > 0 && (
            <tr>
              <td className="border-l-2 border-r-2 border-black p-3">Labor Charges</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-center">998314</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-center">1</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹{invoice.laborCharges.toFixed(2)}</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹0.00</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹{invoice.laborCharges.toFixed(2)}</td>
            </tr>
          )}
          {invoice.extraCharges?.map((charge, index) => (
            <tr key={`extra-${index}`}>
              <td className="border-l-2 border-r-2 border-black p-3">{charge.name}</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-center">998314</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-center">1</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹{charge.amount.toFixed(2)}</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹0.00</td>
              <td className="border-l-2 border-r-2 border-black p-3 text-right">₹{charge.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border-2 border-black p-3" colSpan={6}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ItemsTable;
