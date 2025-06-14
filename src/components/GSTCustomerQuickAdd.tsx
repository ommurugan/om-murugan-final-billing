
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { Customer } from "@/types/billing";
import { useCreateCustomer } from "@/hooks/useCustomers";
import { useCreateVehicle } from "@/hooks/useVehicles";

interface GSTCustomerQuickAddProps {
  onCustomerAdded: (customer: Customer) => void;
}

const GSTCustomerQuickAdd = ({ onCustomerAdded }: GSTCustomerQuickAddProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    vehicleNumber: "",
    make: "",
    model: "",
    vehicleType: "car"
  });

  const createCustomer = useCreateCustomer();
  const createVehicle = useCreateVehicle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.gstNumber) {
      toast.error("Name, phone, and GST number are required");
      return;
    }

    try {
      // Create customer first
      const customerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "",
        address: formData.address || "",
        gstNumber: formData.gstNumber,
        totalSpent: 0
      };

      const customer = await createCustomer.mutateAsync(customerData);
      
      // Create vehicle if vehicle details are provided
      if (formData.vehicleNumber && formData.make && formData.model) {
        await createVehicle.mutateAsync({
          customer_id: customer.id,
          vehicle_number: formData.vehicleNumber,
          make: formData.make,
          model: formData.model,
          vehicle_type: formData.vehicleType
        });
      }

      // Transform to match the expected Customer interface
      const transformedCustomer: Customer = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address || "",
        gstNumber: customer.gst_number || "",
        totalSpent: 0,
        createdAt: customer.created_at,
        loyaltyPoints: 0
      };

      onCustomerAdded(transformedCustomer);
      setOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        gstNumber: "",
        vehicleNumber: "",
        make: "",
        model: "",
        vehicleType: "car"
      });
      toast.success("GST Customer and vehicle added successfully!");
    } catch (error) {
      console.error("Error creating GST customer:", error);
      toast.error("Failed to create GST customer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add GST Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New GST Customer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Customer name"
              required
            />
          </div>
          <div>
            <Label>Phone *</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone number"
              required
            />
          </div>
          <div>
            <Label>GST Number *</Label>
            <Input
              value={formData.gstNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
              placeholder="GST Number (e.g., 27AAPCS1959B1ZI)"
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email address"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Address"
            />
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Vehicle Details (Optional)</h4>
            <div className="space-y-3">
              <div>
                <Label>Vehicle Number</Label>
                <Input
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                  placeholder="Vehicle number"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Make</Label>
                  <Input
                    value={formData.make}
                    onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="Honda, Toyota, etc."
                  />
                </div>
                <div>
                  <Label>Model</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="City, Camry, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createCustomer.isPending}>
              {createCustomer.isPending ? "Adding..." : "Add GST Customer"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GSTCustomerQuickAdd;
