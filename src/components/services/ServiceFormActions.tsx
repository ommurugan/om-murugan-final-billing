
import { Button } from "@/components/ui/button";

interface ServiceFormActionsProps {
  onSubmit: () => void;
  isLoading: boolean;
  isEditMode: boolean;
  isFormValid: boolean;
}

const ServiceFormActions = ({ 
  onSubmit, 
  isLoading, 
  isEditMode, 
  isFormValid 
}: ServiceFormActionsProps) => {
  return (
    <div className="flex-shrink-0 p-6 border-t bg-gray-50">
      <Button 
        onClick={onSubmit} 
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium"
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Service" : "Add Service")}
      </Button>
    </div>
  );
};

export default ServiceFormActions;
