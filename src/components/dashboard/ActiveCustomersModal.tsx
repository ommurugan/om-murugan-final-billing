
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Car } from "lucide-react";

interface ActiveCustomer {
  id: string;
  customerName: string;
  vehicleName: string;
  vehicleNumber: string;
  totalSpent: number;
}

interface ActiveCustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCustomers: ActiveCustomer[];
}

const ActiveCustomersModal = ({ isOpen, onClose, activeCustomers }: ActiveCustomersModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Customers
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {activeCustomers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No active customers</p>
          ) : (
            activeCustomers.map((customer) => (
              <Card key={customer.id} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{customer.customerName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Car className="h-4 w-4" />
                          <span>{customer.vehicleName}</span>
                        </div>
                        <p className="text-xs text-gray-500">Vehicle No: {customer.vehicleNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500">Total Spent</p>
                      <p className="text-lg font-bold text-purple-600">₹{customer.totalSpent.toLocaleString()}</p>
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

export default ActiveCustomersModal;
