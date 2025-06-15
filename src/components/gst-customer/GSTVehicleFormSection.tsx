
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GSTCustomerFormData } from "@/hooks/useGSTCustomerForm";

interface GSTVehicleFormSectionProps {
  formData: GSTCustomerFormData;
  onUpdateField: (field: keyof GSTCustomerFormData, value: string) => void;
}

const GSTVehicleFormSection = ({ formData, onUpdateField }: GSTVehicleFormSectionProps) => {
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-3">Vehicle Details (Required)</h4>
      <div className="space-y-3">
        <div>
          <Label>Vehicle Number *</Label>
          <Input
            value={formData.vehicleNumber}
            onChange={(e) => onUpdateField("vehicleNumber", e.target.value)}
            placeholder="Vehicle number"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Make *</Label>
            <Input
              value={formData.make}
              onChange={(e) => onUpdateField("make", e.target.value)}
              placeholder="Honda, Toyota, etc."
              required
            />
          </div>
          <div>
            <Label>Model *</Label>
            <Input
              value={formData.model}
              onChange={(e) => onUpdateField("model", e.target.value)}
              placeholder="City, Camry, etc."
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTVehicleFormSection;
