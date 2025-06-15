
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GSTCustomerFormData } from "@/hooks/useGSTCustomerForm";

interface GSTCustomerFormSectionProps {
  formData: GSTCustomerFormData;
  onUpdateField: (field: keyof GSTCustomerFormData, value: string) => void;
}

const GSTCustomerFormSection = ({ formData, onUpdateField }: GSTCustomerFormSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => onUpdateField("name", e.target.value)}
          placeholder="Customer name"
          required
        />
      </div>
      <div>
        <Label>Phone *</Label>
        <Input
          value={formData.phone}
          onChange={(e) => onUpdateField("phone", e.target.value)}
          placeholder="Phone number"
          required
        />
      </div>
      <div>
        <Label>GST Number *</Label>
        <Input
          value={formData.gstNumber}
          onChange={(e) => onUpdateField("gstNumber", e.target.value)}
          placeholder="GST Number (e.g., 27AAPCS1959B1ZI)"
          required
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onUpdateField("email", e.target.value)}
          placeholder="Email address"
        />
      </div>
      <div>
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => onUpdateField("address", e.target.value)}
          placeholder="Address"
        />
      </div>
    </div>
  );
};

export default GSTCustomerFormSection;
