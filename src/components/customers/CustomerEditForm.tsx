
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X } from "lucide-react";
import { Customer } from "@/types/billing";

interface CustomerEditFormProps {
  customer: Customer;
  onSave: () => void;
  onCancel: () => void;
  onChange: (customer: Customer) => void;
  isSaving: boolean;
}

const CustomerEditForm = ({ 
  customer, 
  onSave, 
  onCancel, 
  onChange, 
  isSaving 
}: CustomerEditFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          value={customer.name}
          onChange={(e) => onChange({...customer, name: e.target.value})}
          placeholder="Customer name"
        />
        <Input
          value={customer.phone}
          onChange={(e) => onChange({...customer, phone: e.target.value})}
          placeholder="Phone number"
        />
        <Input
          value={customer.email || ""}
          onChange={(e) => onChange({...customer, email: e.target.value})}
          placeholder="Email address"
        />
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onSave} 
          size="sm"
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-1" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CustomerEditForm;
