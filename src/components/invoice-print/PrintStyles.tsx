
import React from 'react';

const PrintStyles = () => {
  return (
    <style>{`
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        
        /* Hide all elements except the print content */
        body * {
          visibility: hidden !important;
        }
        
        .print-content, .print-content * {
          visibility: visible !important;
        }
        
        .print-content {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 15mm !important;
          box-sizing: border-box !important;
          page-break-after: avoid !important;
        }

        /* Hide all UI elements that shouldn't print */
        nav, .mobile-nav, .bottom-nav, [class*="bottom"], [class*="navigation"], 
        button, .print-controls, .no-print {
          display: none !important;
          visibility: hidden !important;
        }

        /* Ensure table formatting */
        table {
          border-collapse: collapse !important;
          width: 100% !important;
          page-break-inside: avoid !important;
        }

        /* Prevent page breaks in critical sections */
        tbody tr {
          page-break-inside: avoid !important;
        }
        
        thead {
          display: table-header-group !important;
        }
        
        tfoot {
          display: table-footer-group !important;
        }

        /* Ensure images print correctly */
        img {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          max-width: 100% !important;
        }
        
        @page {
          margin: 10mm !important;
          size: A4 !important;
        }
        
        /* Force single page layout */
        html, body {
          height: auto !important;
          overflow: visible !important;
          page-break-after: avoid !important;
        }
        
        /* Prevent duplicate content */
        .print-content ~ * {
          display: none !important;
        }
      }
    `}</style>
  );
};

export default PrintStyles;
