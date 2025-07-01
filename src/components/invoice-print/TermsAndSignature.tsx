
import React from 'react';
import { Invoice } from '@/types/billing';

interface TermsAndSignatureProps {
  invoice: Invoice;
}

const TermsAndSignature = ({ invoice }: TermsAndSignatureProps) => {
  return (
    <>
      {/* Notes */}
      {invoice.notes && (
        <div className="mb-6">
          <h3 className="font-bold mb-2">NOTES:</h3>
          <p className="text-sm border p-3 rounded">{invoice.notes}</p>
        </div>
      )}

      {/* Terms and Signature */}
      <div className="grid grid-cols-2 gap-8 mt-12">
        <div>
          <h3 className="font-bold mb-2">TERMS & CONDITIONS:</h3>
          <div className="text-sm space-y-1">
            <p>• Payment is due within 30 days</p>
            <p>• All services carry warranty as per terms</p>
            <p>• Vehicle will be released only after payment</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-black mt-16 pt-2">
            <p className="font-bold">Authorized Signature</p>
            <p className="text-sm">OM MURUGAN AUTO WORKS</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndSignature;
