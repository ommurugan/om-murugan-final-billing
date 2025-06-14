
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { useCreatePart, useUpdatePart, Part } from "@/hooks/useParts";

interface PartFormDialogProps {
  editingPart?: Part | null;
  onEditingChange?: (part: Part | null) => void;
  isAddForm?: boolean;
}

const PartFormDialog = ({ editingPart, onEditingChange, isAddForm = false }: PartFormDialogProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newPart, setNewPart] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    supplier: "",
    part_number: "",
    min_stock_level: ""
  });

  const createPartMutation = useCreatePart();
  const updatePartMutation = useUpdatePart();

  const handleAddPart = async () => {
    if (!newPart.name || !newPart.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await createPartMutation.mutateAsync({
        name: newPart.name,
        category: newPart.category,
        price: parseFloat(newPart.price),
        stock_quantity: parseInt(newPart.stock_quantity) || 0,
        min_stock_level: parseInt(newPart.min_stock_level) || 0,
        supplier: newPart.supplier || undefined,
        part_number: newPart.part_number || undefined,
        is_active: true
      });
      
      toast.success("Part added successfully!");
      setShowForm(false);
      setNewPart({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        supplier: "",
        part_number: "",
        min_stock_level: ""
      });
    } catch (error) {
      toast.error("Failed to add part");
      console.error("Error adding part:", error);
    }
  };

  const handleUpdatePart = async () => {
    if (!editingPart || !editingPart.name || !editingPart.price) {
      toast.error("Please fill in required fields");
      return;
    }
    
    try {
      await updatePartMutation.mutateAsync({
        id: editingPart.id,
        name: editingPart.name,
        category: editingPart.category,
        price: editingPart.price,
        stock_quantity: editingPart.stock_quantity,
        min_stock_level: editingPart.min_stock_level,
        supplier: editingPart.supplier,
        part_number: editingPart.part_number
      });
      
      toast.success("Part updated successfully!");
      onEditingChange?.(null);
    } catch (error) {
      toast.error("Failed to update part");
      console.error("Error updating part:", error);
    }
  };

  if (isAddForm) {
    return (
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700" disabled={createPartMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Add Part
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Part</DialogTitle>
            <DialogDescription>
              Add a new spare part to your inventory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="partName">Part Name *</Label>
              <Input 
                id="partName"
                value={newPart.name}
                onChange={(e) => setNewPart({...newPart, name: e.target.value})}
                placeholder="Enter part name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partPrice">Price (₹) *</Label>
                <Input 
                  id="partPrice"
                  type="number"
                  value={newPart.price}
                  onChange={(e) => setNewPart({...newPart, price: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="partStock">Stock Quantity</Label>
                <Input 
                  id="partStock"
                  type="number"
                  value={newPart.stock_quantity}
                  onChange={(e) => setNewPart({...newPart, stock_quantity: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partCategory">Category</Label>
                <Input 
                  id="partCategory"
                  value={newPart.category}
                  onChange={(e) => setNewPart({...newPart, category: e.target.value})}
                  placeholder="e.g., Filters, Brake System"
                />
              </div>
              <div>
                <Label htmlFor="partSupplier">Supplier</Label>
                <Input 
                  id="partSupplier"
                  value={newPart.supplier}
                  onChange={(e) => setNewPart({...newPart, supplier: e.target.value})}
                  placeholder="Supplier name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partNumber">Part Number</Label>
                <Input 
                  id="partNumber"
                  value={newPart.part_number}
                  onChange={(e) => setNewPart({...newPart, part_number: e.target.value})}
                  placeholder="Part number"
                />
              </div>
              <div>
                <Label htmlFor="minStockLevel">Min Stock Level</Label>
                <Input 
                  id="minStockLevel"
                  type="number"
                  value={newPart.min_stock_level}
                  onChange={(e) => setNewPart({...newPart, min_stock_level: e.target.value})}
                  placeholder="5"
                />
              </div>
            </div>
            <Button 
              onClick={handleAddPart} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={createPartMutation.isPending}
            >
              {createPartMutation.isPending ? "Adding..." : "Add Part"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={editingPart?.id !== undefined} onOpenChange={(open) => !open && onEditingChange?.(null)}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Part</DialogTitle>
          <DialogDescription>
            Update the part details
          </DialogDescription>
        </DialogHeader>
        {editingPart && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="editPartName">Part Name *</Label>
              <Input 
                id="editPartName"
                value={editingPart.name}
                onChange={(e) => onEditingChange?.({...editingPart, name: e.target.value})}
                placeholder="Enter part name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPartPrice">Price (₹) *</Label>
                <Input 
                  id="editPartPrice"
                  type="number"
                  value={editingPart.price}
                  onChange={(e) => onEditingChange?.({...editingPart, price: parseFloat(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="editPartStock">Stock Quantity</Label>
                <Input 
                  id="editPartStock"
                  type="number"
                  value={editingPart.stock_quantity}
                  onChange={(e) => onEditingChange?.({...editingPart, stock_quantity: parseInt(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPartCategory">Category</Label>
                <Input 
                  id="editPartCategory"
                  value={editingPart.category}
                  onChange={(e) => onEditingChange?.({...editingPart, category: e.target.value})}
                  placeholder="e.g., Filters, Brake System"
                />
              </div>
              <div>
                <Label htmlFor="editPartSupplier">Supplier</Label>
                <Input 
                  id="editPartSupplier"
                  value={editingPart.supplier || ""}
                  onChange={(e) => onEditingChange?.({...editingPart, supplier: e.target.value})}
                  placeholder="Supplier name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPartNumber">Part Number</Label>
                <Input 
                  id="editPartNumber"
                  value={editingPart.part_number || ""}
                  onChange={(e) => onEditingChange?.({...editingPart, part_number: e.target.value})}
                  placeholder="Part number"
                />
              </div>
              <div>
                <Label htmlFor="editMinStockLevel">Min Stock Level</Label>
                <Input 
                  id="editMinStockLevel"
                  type="number"
                  value={editingPart.min_stock_level}
                  onChange={(e) => onEditingChange?.({...editingPart, min_stock_level: parseInt(e.target.value)})}
                  placeholder="5"
                />
              </div>
            </div>
            <Button 
              onClick={handleUpdatePart} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={updatePartMutation.isPending}
            >
              {updatePartMutation.isPending ? "Updating..." : "Update Part"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PartFormDialog;
