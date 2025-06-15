
import { toast } from "sonner";
import { Customer } from "@/types/billing";
import { useCreateCustomer } from "@/hooks/useCustomers";
import { useCreateVehicle } from "@/hooks/useVehicles";
import { CustomerFormData } from "./useCustomerForm";

export const useCustomerSubmission = () => {
  const createCustomer = useCreateCustomer();
  const createVehicle = useCreateVehicle();

  const submitForm = async (
    formData: CustomerFormData,
    onSuccess: (customer: Customer) => void,
    onComplete: () => void
  ) => {
    try {
      // Create customer first
      const customerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "",
        address: formData.address || "",
        gstNumber: "",
        totalSpent: 0
      };

      const customer = await createCustomer.mutateAsync(customerData);
      
      // Create vehicle - now always required
      await createVehicle.mutateAsync({
        customer_id: customer.id,
        vehicle_number: formData.vehicleNumber,
        make: formData.make,
        model: formData.model,
        vehicle_type: formData.vehicleType
      });

      // Transform to match the expected Customer interface
      const transformedCustomer: Customer = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address || "",
        gstNumber: "",
        totalSpent: 0,
        createdAt: customer.created_at,
        loyaltyPoints: 0
      };

      onSuccess(transformedCustomer);
      onComplete();
      toast.success("Customer and vehicle added successfully!");
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer");
    }
  };

  return {
    submitForm,
    isLoading: createCustomer.isPending
  };
};
