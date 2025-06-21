
import React from 'react';
import { Invoice, Customer, Vehicle } from '@/types/billing';

interface ProfessionalInvoicePrintProps {
  invoice: Invoice;
  customer: Customer;
  vehicle: Vehicle;
  onClose: () => void;
}

const ProfessionalInvoicePrint = ({ invoice, customer, vehicle, onClose }: ProfessionalInvoicePrintProps) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const calculateGSTAmounts = () => {
    if (invoice.invoiceType === 'gst') {
      const cgst = invoice.taxAmount / 2;
      const sgst = invoice.taxAmount / 2;
      return { cgst, sgst };
    }
    return { cgst: 0, sgst: 0 };
  };

  const { cgst, sgst } = calculateGSTAmounts();

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Screen controls - hidden when printing */}
      <div className="print:hidden p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold">Invoice Print Preview</h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
          >
            Print Invoice
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {/* Professional Invoice Template */}
      <div className="print-content max-w-4xl mx-auto p-8 print:p-4 print:max-w-none print:mx-0 bg-white">
        {/* Company Header */}
        <div className="border-b-2 border-gray-800 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
                alt="OM MURUGAN AUTO WORKS" 
                className="h-20 w-20 mr-6"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">OM MURUGAN AUTO WORKS</h1>
                <p className="text-lg text-gray-600 mb-1">Complete Auto Care Solutions</p>
                <p className="text-sm text-gray-600">Phone: +91 98765 43210 | Email: info@ommurugan.com</p>
                <p className="text-sm text-gray-600">Bank: SBI | A/C: 1234567890 | IFSC: SBIN0001234</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-600 text-white px-4 py-2 rounded mb-2">
                <h2 className="text-xl font-bold">
                  {invoice.invoiceType === 'gst' ? 'TAX INVOICE' : 'INVOICE'}
                </h2>
              </div>
              {invoice.invoiceType === 'gst' && (
                <p className="text-sm text-gray-600">GSTIN: 33AAAAA0000A1Z5</p>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">BILL TO:</h3>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">{customer.name}</p>
              <p className="text-gray-700">Phone: {customer.phone}</p>
              {customer.email && <p className="text-gray-700">Email: {customer.email}</p>}
              {customer.address && <p className="text-gray-700">Address: {customer.address}</p>}
              {customer.gstNumber && invoice.invoiceType === 'gst' && (
                <p className="text-gray-700"><strong>GSTIN:</strong> {customer.gstNumber}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="font-semibold">Invoice No:</span>
                <span>{invoice.invoiceNumber}</span>
                <span className="font-semibold">Date:</span>
                <span>{formatDate(invoice.createdAt)}</span>
                <span className="font-semibold">Due Date:</span>
                <span>{formatDate(invoice.dueDate)}</span>
                {invoice.invoiceType === 'gst' && (
                  <>
                    <span className="font-semibold">Place of Supply:</span>
                    <span>Tamil Nadu</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-gray-50 p-4 rounded mb-6 border">
          <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">VEHICLE DETAILS:</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p><strong>Vehicle:</strong> {vehicle.make} {vehicle.model}</p>
              <p><strong>Registration:</strong> {vehicle.vehicleNumber}</p>
            </div>
            <div>
              <p><strong>Type:</strong> {vehicle.vehicleType}</p>
              {vehicle.year && <p><strong>Year:</strong> {vehicle.year}</p>}
            </div>
            <div>
              {vehicle.color && <p><strong>Color:</strong> {vehicle.color}</p>}
              {invoice.kilometers && <p><strong>Kilometers:</strong> {invoice.kilometers.toLocaleString()} km</p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border border-gray-800 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-800 p-3 text-left text-sm font-bold">S.No</th>
              <th className="border border-gray-800 p-3 text-left text-sm font-bold">Description of Goods/Services</th>
              {invoice.invoiceType === 'gst' && (
                <th className="border border-gray-800 p-3 text-center text-sm font-bold">HSN/SAC</th>
              )}
              <th className="border border-gray-800 p-3 text-center text-sm font-bold">Qty</th>
              <th className="border border-gray-800 p-3 text-right text-sm font-bold">Rate</th>
              <th className="border border-gray-800 p-3 text-right text-sm font-bold">Discount</th>
              <th className="border border-gray-800 p-3 text-right text-sm font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-800 p-2 text-center text-sm">{index + 1}</td>
                <td className="border border-gray-800 p-2 text-sm">
                  {item.name}
                  <div className="text-xs text-gray-600 capitalize">({item.type})</div>
                </td>
                {invoice.invoiceType === 'gst' && (
                  <td className="border border-gray-800 p-2 text-center text-sm">
                    {item.hsnCode || (item.type === 'service' ? '998314' : '998313')}
                  </td>
                )}
                <td className="border border-gray-800 p-2 text-center text-sm">{item.quantity}</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹{item.unitPrice.toFixed(2)}</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹{item.discount.toFixed(2)}</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
            {invoice.laborCharges > 0 && (
              <tr>
                <td className="border border-gray-800 p-2 text-center text-sm">{invoice.items.length + 1}</td>
                <td className="border border-gray-800 p-2 text-sm">Labor Charges</td>
                {invoice.invoiceType === 'gst' && (
                  <td className="border border-gray-800 p-2 text-center text-sm">998314</td>
                )}
                <td className="border border-gray-800 p-2 text-center text-sm">1</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹{invoice.laborCharges.toFixed(2)}</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹0.00</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹{invoice.laborCharges.toFixed(2)}</td>
              </tr>
            )}
            {invoice.extraCharges?.map((charge, index) => (
              <tr key={`extra-${index}`}>
                <td className="border border-gray-800 p-2 text-center text-sm">
                  {invoice.items.length + (invoice.laborCharges > 0 ? 2 : 1) + index}
                </td>
                <td className="border border-gray-800 p-2 text-sm">{charge.name}</td>
                {invoice.invoiceType === 'gst' && (
                  <td className="border border-gray-800 p-2 text-center text-sm">998314</td>
                )}
                <td className="border border-gray-800 p-2 text-center text-sm">1</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹{charge.amount.toFixed(2)}</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹0.00</td>
                <td className="border border-gray-800 p-2 text-right text-sm">₹{charge.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tax Calculation */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            {invoice.notes && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2">NOTES:</h4>
                <p className="text-sm text-gray-700 border p-3 rounded bg-gray-50">{invoice.notes}</p>
              </div>
            )}
          </div>
          <div>
            <table className="w-full border border-gray-800">
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-2 text-sm font-semibold">Subtotal:</td>
                  <td className="border border-gray-800 p-2 text-right text-sm">₹{invoice.subtotal.toFixed(2)}</td>
                </tr>
                {invoice.discount > 0 && (
                  <tr>
                    <td className="border border-gray-800 p-2 text-sm font-semibold">Discount ({invoice.discount}%):</td>
                    <td className="border border-gray-800 p-2 text-right text-sm text-red-600">-₹{((invoice.subtotal * invoice.discount) / 100).toFixed(2)}</td>
                  </tr>
                )}
                {invoice.invoiceType === 'gst' && invoice.taxRate > 0 && (
                  <>
                    <tr>
                      <td className="border border-gray-800 p-2 text-sm font-semibold">CGST ({(invoice.taxRate / 2).toFixed(1)}%):</td>
                      <td className="border border-gray-800 p-2 text-right text-sm">₹{cgst.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-800 p-2 text-sm font-semibold">SGST ({(invoice.taxRate / 2).toFixed(1)}%):</td>
                      <td className="border border-gray-800 p-2 text-right text-sm">₹{sgst.toFixed(2)}</td>
                    </tr>
                  </>
                )}
                {invoice.invoiceType === 'non-gst' && invoice.taxAmount > 0 && (
                  <tr>
                    <td className="border border-gray-800 p-2 text-sm font-semibold">Tax ({invoice.taxRate}%):</td>
                    <td className="border border-gray-800 p-2 text-right text-sm">₹{invoice.taxAmount.toFixed(2)}</td>
                  </tr>
                )}
                <tr className="bg-gray-100">
                  <td className="border border-gray-800 p-3 text-lg font-bold">TOTAL AMOUNT:</td>
                  <td className="border border-gray-800 p-3 text-right text-lg font-bold">₹{invoice.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Terms and Signature */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div>
            <h4 className="font-bold text-gray-800 mb-3">TERMS & CONDITIONS:</h4>
            <div className="text-sm space-y-1 text-gray-700">
              <p>• Payment is due within 30 days from invoice date</p>
              <p>• All services carry warranty as per company terms</p>
              <p>• Vehicle will be released only after full payment</p>
              <p>• Interest @24% p.a. will be charged on overdue amounts</p>
              <p>• Subject to {invoice.invoiceType === 'gst' ? 'Tamil Nadu' : 'Local'} jurisdiction</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-800 mt-16 pt-4">
              <p className="font-bold text-gray-800 text-lg">Authorized Signatory</p>
              <p className="text-sm text-gray-600 mt-2">OM MURUGAN AUTO WORKS</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>Thank you for choosing OM MURUGAN AUTO WORKS - Your trusted auto care partner</p>
        </div>
      </div>

      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print-content, .print-content * {
            visibility: visible;
          }
          
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          
          /* Hide browser-generated content */
          @page {
            margin: 0.5in;
            size: A4;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          /* Remove browser headers and footers */
          body::before,
          body::after {
            display: none !important;
          }
          
          /* Ensure clean print layout */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalInvoicePrint;
