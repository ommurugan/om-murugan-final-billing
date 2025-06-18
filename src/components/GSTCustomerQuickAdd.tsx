
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useCreateCustomer } from "@/hooks/useCustomers";
import { useCreateVehicle } from "@/hooks/useVehicles";

interface GSTCustomerQuickAddProps {
  onCustomerAdded: (customer: any) => void;
}

const GSTCustomerQuickAdd = ({ onCustomerAdded }: GSTCustomerQuickAddProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [year, setYear] = useState("");
  const [vehicleType, setVehicleType] = useState<'car' | 'bike' | 'scooter' | 'van' | 'truck'>('car');

  const createCustomer = useCreateCustomer();
  const createVehicle = useCreateVehicle();

  const handleSubmit = async () => {
    if (!name || !phone || !make || !model || !vehicleNumber || !vehicleType || !gstNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Create customer
      const customerData = {
        name,
        phone,
        email,
        gstNumber,
        totalSpent: 0,
        address: ""
      };

      const newCustomer = await createCustomer.mutateAsync(customerData);

      if (!newCustomer) {
        toast.error("Failed to create customer");
        return;
      }

      // Create vehicle - convert year to number
      const vehicleData = {
        customer_id: newCustomer.id,
        make,
        model,
        vehicle_number: vehicleNumber,
        year: year ? parseInt(year) : undefined,
        vehicle_type: vehicleType,
        engine_number: "",
        chassis_number: "",
        color: ""
      };

      const newVehicle = await createVehicle.mutateAsync(vehicleData);

      if (!newVehicle) {
        toast.error("Failed to create vehicle");
        return;
      }

      // Notify parent component
      onCustomerAdded({ ...newCustomer, vehicles: [newVehicle] });

      // Reset form and close dialog
      setOpen(false);
      setName("");
      setPhone("");
      setEmail("");
      setGstNumber("");
      setMake("");
      setModel("");
      setVehicleNumber("");
      setYear("");
      setVehicleType('car');

      toast.success("GST Customer and vehicle added successfully!");
    } catch (error: any) {
      console.error("Error creating customer or vehicle:", error);
      toast.error(error?.message || "Failed to create customer and vehicle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add GST Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New GST Customer & Vehicle</DialogTitle>
          <DialogDescription>
            Add a new GST customer and their vehicle details
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Customer Details */}
          <div className="space-y-4">
            <h4 className="font-medium">Customer Information</h4>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gst-number">GST Number</Label>
              <Input id="gst-number" type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
            </div>
          </div>

          <Separator />

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h4 className="font-medium">Vehicle Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle-type">Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={(value: 'car' | 'bike' | 'scooter' | 'van' | 'truck') => setVehicleType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle-number">Vehicle Number</Label>
                <Input id="vehicle-number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={createCustomer.isPending}>
            {createCustomer.isPending ? "Adding..." : "Add Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GSTCustomerQuickAdd;
