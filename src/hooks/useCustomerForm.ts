
import { useState } from "react";

export interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicleNumber: string;
  make: string;
  model: string;
  vehicleType: string;
}

export const useCustomerForm = () => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    vehicleNumber: "",
    make: "",
    model: "",
    vehicleType: "car"
  });

  const updateFormData = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      vehicleNumber: "",
      make: "",
      model: "",
      vehicleType: "car"
    });
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name || !formData.phone) {
      errors.push("Name and phone are required");
    }

    if (!formData.vehicleNumber || !formData.make || !formData.model) {
      errors.push("Vehicle details (Vehicle Number, Make, and Model) are required");
    }

    return errors;
  };

  return {
    formData,
    updateFormData,
    resetForm,
    validateForm
  };
};
