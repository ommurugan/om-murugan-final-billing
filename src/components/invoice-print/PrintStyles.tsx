
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
        }
        
        /* Hide all elements except the print content */
        body * {
          visibility: hidden;
        }
        
        .print-content, .print-content * {
          visibility: visible;
        }
        
        .print-content {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 15mm !important;
          box-sizing: border-box;
        }

        /* Hide mobile navigation and other UI elements */
        nav, .mobile-nav, .bottom-nav, [class*="bottom"], [class*="navigation"] {
          display: none !important;
          visibility: hidden !important;
        }

        table {
          border-collapse: collapse !important;
          width: 100% !important;
        }

        img {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        @page {
          margin: 10mm;
          size: A4;
        }
        
        /* Prevent page breaks inside table rows */
        tbody tr {
          page-break-inside: avoid;
        }
        
        /* Ensure only one page prints */
        html, body {
          height: auto !important;
          overflow: visible !important;
        }
      }
    `}</style>
  );
};

export default PrintStyles;
