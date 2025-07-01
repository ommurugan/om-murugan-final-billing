
import React from 'react';

interface PrintControlsProps {
  onPrint: () => void;
  onClose: () => void;
}

const PrintControls = ({ onPrint, onClose }: PrintControlsProps) => {
  return (
    <div className="print:hidden p-4 border-b flex justify-between items-center bg-gray-50">
      <h2 className="text-xl font-bold">Invoice Preview</h2>
      <div className="flex gap-2">
        <button 
          onClick={onPrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print
        </button>
        <button 
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PrintControls;
