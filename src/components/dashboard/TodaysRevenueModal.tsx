
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Receipt } from "lucide-react";

interface RevenueItem {
  id: string;
  vehicleInfo: string;
  services: string[];
  parts: string[];
  amount: number;
  customerName: string;
}

interface TodaysRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  revenueItems: RevenueItem[];
}

const TodaysRevenueModal = ({ isOpen, onClose, revenueItems }: TodaysRevenueModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Today's Revenue Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {revenueItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No revenue recorded today</p>
          ) : (
            revenueItems.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{item.customerName}</p>
                        <p className="text-sm text-gray-600">{item.vehicleInfo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₹{item.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.services.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Services</p>
                        <ul className="text-sm text-gray-700">
                          {item.services.map((service, idx) => (
                            <li key={idx}>• {service}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.parts.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parts</p>
                        <ul className="text-sm text-gray-700">
                          {item.parts.map((part, idx) => (
                            <li key={idx}>• {part}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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

export default TodaysRevenueModal;
