
import React from 'react';

const PrintHeader = () => {
  return (
    <div className="text-center border-b-2 border-black pb-4 mb-6">
      <div className="flex items-center justify-center mb-4">
        <img 
          src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
          alt="OM MURUGAN AUTO WORKS" 
          className="h-16 w-16 mr-4 print:h-20 print:w-20"
          style={{ printColorAdjust: 'exact', colorAdjust: 'exact' }}
        />
        <div>
          <h1 className="text-3xl font-bold print:text-4xl">OM MURUGAN AUTO WORKS</h1>
          <p className="text-lg mt-2 print:text-xl">Complete Auto Care Solutions</p>
        </div>
      </div>
      <div className="text-sm print:text-base space-y-1">
        <p>Door No.8, 4th Main Road, Manikandapuram, Thirumullaivoyal,</p>
        <p>Chennai-600 062.</p>
        <div className="flex justify-center items-center gap-8 mt-3">
          <p><strong>GSTIN/UIN:</strong> 33AXNPG2146F1ZR</p>
          <p><strong>State Name:</strong> Tamil Nadu, <strong>Code:</strong> 33</p>
        </div>
        <div className="flex justify-center items-center gap-8 mt-2">
          <p><strong>E-Mail:</strong> gopalakrish.p86@gmail.com</p>
          <p><strong>Phone:</strong> + 91 9884551560</p>
        </div>
      </div>
    </div>
  );
};

export default PrintHeader;
