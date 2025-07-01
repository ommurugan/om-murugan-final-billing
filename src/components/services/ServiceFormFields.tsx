
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ServiceFormData {
  name: string;
  description: string;
  base_price: string;
  labor_charges: string;
  estimated_time: string;
  category: string;
  hsn_code: string;
}

interface ServiceFormFieldsProps {
  formData: ServiceFormData;
  onFormDataChange: (data: ServiceFormData) => void;
}

const ServiceFormFields = ({ formData, onFormDataChange }: ServiceFormFieldsProps) => {
  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Service Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="e.g., Oil Change Service"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => handleInputChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="repair">Repair</SelectItem>
            <SelectItem value="inspection">Inspection</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="electrical">Electrical</SelectItem>
            <SelectItem value="bodywork">Body Work</SelectItem>
            <SelectItem value="engine">Engine</SelectItem>
            <SelectItem value="transmission">Transmission</SelectItem>
            <SelectItem value="brake">Brake System</SelectItem>
            <SelectItem value="suspension">Suspension</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="base_price" className="text-sm font-medium">
          Base Price (₹) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="base_price"
          type="number"
          value={formData.base_price}
          onChange={(e) => handleInputChange('base_price', e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="labor_charges" className="text-sm font-medium">
          Labor Charges (₹)
        </Label>
        <Input
          id="labor_charges"
          type="number"
          value={formData.labor_charges}
          onChange={(e) => handleInputChange('labor_charges', e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hsn_code" className="text-sm font-medium">
          SAC Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="hsn_code"
          value={formData.hsn_code}
          onChange={(e) => handleInputChange('hsn_code', e.target.value)}
          placeholder="e.g., 998314"
          className="w-full"
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of the service..."
          rows={3}
          className="w-full resize-none"
        />
      </div>
    </div>
  );
};

export default ServiceFormFields;
