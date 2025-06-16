
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Car, User } from "lucide-react";

interface ServicedVehicle {
  id: string;
  customerName: string;
  vehicleName: string;
  vehicleNumber: string;
  services: string[];
  parts: string[];
}

interface VehiclesServicedModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicedVehicles: ServicedVehicle[];
}

const VehiclesServicedModal = ({ isOpen, onClose, servicedVehicles }: VehiclesServicedModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicles Serviced Today
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {servicedVehicles.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No vehicles serviced today</p>
          ) : (
            servicedVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <p className="font-semibold text-gray-900">{vehicle.customerName}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{vehicle.vehicleName}</p>
                      <p className="text-xs text-gray-500">Vehicle No: {vehicle.vehicleNumber}</p>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {vehicle.services.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Services Used</p>
                            <ul className="text-sm text-gray-700">
                              {vehicle.services.map((service, idx) => (
                                <li key={idx}>• {service}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {vehicle.parts.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parts Used</p>
                            <ul className="text-sm text-gray-700">
                              {vehicle.parts.map((part, idx) => (
                                <li key={idx}>• {part}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehiclesServicedModal;
