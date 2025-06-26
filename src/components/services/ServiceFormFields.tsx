
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ServiceFormFieldsProps {
  formData: {
    name: string;
    description: string;
    base_price: string;
    labor_charges: string;
    category: string;
    hsn_code: string;
  };
  onFormDataChange: (data: any) => void;
}

const ServiceFormFields = ({ formData, onFormDataChange }: ServiceFormFieldsProps) => {
  const updateFormData = (field: string, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="serviceName" className="text-base font-medium">Service Name *</Label>
          <Input 
            id="serviceName"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter service name"
            className="mt-2 h-11"
          />
        </div>
        <div>
          <Label htmlFor="serviceCategory" className="text-base font-medium">Category</Label>
          <Input 
            id="serviceCategory"
            value={formData.category}
            onChange={(e) => updateFormData('category', e.target.value)}
            placeholder="e.g., Maintenance, Repair"
            className="mt-2 h-11"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="serviceDescription" className="text-base font-medium">Description</Label>
        <Textarea 
          id="serviceDescription"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe the service"
          rows={4}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="servicePrice" className="text-base font-medium">Price (₹) *</Label>
          <Input 
            id="servicePrice"
            type="number"
            value={formData.base_price}
            onChange={(e) => updateFormData('base_price', e.target.value)}
            placeholder="0"
            className="mt-2 h-11"
          />
        </div>
        <div>
          <Label htmlFor="laborCharges" className="text-base font-medium">Labor Charges (₹)</Label>
          <Input 
            id="laborCharges"
            type="number"
            value={formData.labor_charges}
            onChange={(e) => updateFormData('labor_charges', e.target.value)}
            placeholder="0"
            className="mt-2 h-11"
          />
        </div>
        <div>
          <Label htmlFor="sacCode" className="text-base font-medium">SAC Code</Label>
          <Input 
            id="sacCode"
            value={formData.hsn_code}
            onChange={(e) => updateFormData('hsn_code', e.target.value)}
            placeholder="e.g., 998314"
            className="mt-2 h-11"
          />
        </div>
      </div>
    </>
  );
};

export default ServiceFormFields;
