
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useParts, useCreatePart, useUpdatePart, useDeletePart, Part } from "@/hooks/useParts";
import PartCard from "./PartCard";
import PartForm from "./PartForm";

interface PartsTabProps {
  filteredParts: Part[];
  partsLoading: boolean;
}

const PartsTab = ({ filteredParts, partsLoading }: PartsTabProps) => {
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  
  const createPartMutation = useCreatePart();
  const updatePartMutation = useUpdatePart();
  const deletePartMutation = useDeletePart();

  const handleAddPart = async (partData: any) => {
    if (!partData.name || !partData.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await createPartMutation.mutateAsync(partData);
      toast.success("Part added successfully!");
      setShowAddPartForm(false);
    } catch (error) {
      toast.error("Failed to add part");
      console.error("Error adding part:", error);
    }
  };

  const handleUpdatePart = async (partData: any) => {
    if (!partData.name || !partData.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await updatePartMutation.mutateAsync(partData);
      toast.success("Part updated successfully!");
      setEditingPart(null);
    } catch (error) {
      toast.error("Failed to update part");
      console.error("Error updating part:", error);
    }
  };

  const handleDeletePart = async (id: string) => {
    try {
      await deletePartMutation.mutateAsync(id);
      toast.success("Part deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete part");
      console.error("Error deleting part:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Parts Inventory</h2>
          <p className="text-gray-600">Manage your spare parts stock and pricing</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700" 
          disabled={createPartMutation.isPending}
          onClick={() => setShowAddPartForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Part
        </Button>
      </div>

      {partsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <PartCard
              key={part.id}
              part={part}
              onEdit={setEditingPart}
              onDelete={handleDeletePart}
              isDeleting={deletePartMutation.isPending}
            />
          ))}
        </div>
      )}

      <PartForm
        isOpen={showAddPartForm}
        onClose={() => setShowAddPartForm(false)}
        onSubmit={handleAddPart}
        isLoading={createPartMutation.isPending}
        title="Add New Part"
        description="Add a new spare part to your inventory"
      />

      <PartForm
        isOpen={!!editingPart}
        onClose={() => setEditingPart(null)}
        onSubmit={handleUpdatePart}
        isLoading={updatePartMutation.isPending}
        editingPart={editingPart}
        title="Edit Part"
        description="Update the part details"
      />
    </div>
  );
};

export default PartsTab;
