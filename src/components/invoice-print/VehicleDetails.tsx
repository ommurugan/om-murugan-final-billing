
import React from 'react';
import { Invoice, Vehicle } from '@/types/billing';

interface VehicleDetailsProps {
  invoice: Invoice;
  vehicle: Vehicle;
}

const VehicleDetails = ({ invoice, vehicle }: VehicleDetailsProps) => {
  return (
    <div className="bg-gray-50 print:bg-gray-100 p-4 rounded mb-6">
      <h3 className="font-bold mb-2">VEHICLE DETAILS:</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Vehicle:</strong> {vehicle.make} {vehicle.model}</p>
          <p><strong>Registration:</strong> {vehicle.vehicleNumber}</p>
        </div>
        <div>
          <p><strong>Type:</strong> {vehicle.vehicleType}</p>
          {invoice.kilometers && (
            <p><strong>Kilometers:</strong> {invoice.kilometers.toLocaleString()} km</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
