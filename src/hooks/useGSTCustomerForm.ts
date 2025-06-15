
import { useState } from "react";

export interface GSTCustomerFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  vehicleNumber: string;
  make: string;
  model: string;
  vehicleType: string;
}

export const useGSTCustomerForm = () => {
  const [formData, setFormData] = useState<GSTCustomerFormData>({
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

  const updateFormData = (field: keyof GSTCustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
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
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name || !formData.phone || !formData.gstNumber) {
      errors.push("Name, phone, and GST number are required");
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
