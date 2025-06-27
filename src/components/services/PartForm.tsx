import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Part } from "@/hooks/useParts";
interface PartFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (partData: any) => void;
  isLoading: boolean;
  editingPart?: Part | null;
  title: string;
  description: string;
}
const PartForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingPart,
  title,
  description
}: PartFormProps) => {
  const [formData, setFormData] = useState({
    name: editingPart?.name || "",
    price: editingPart?.price?.toString() || "",
    category: editingPart?.category || "",
    supplier: editingPart?.supplier || "",
    part_number: editingPart?.part_number || "",
    hsn_code: editingPart?.hsn_code || ""
  });
  const handleSubmit = () => {
    if (editingPart) {
      onSubmit({
        id: editingPart.id,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock_quantity: editingPart.stock_quantity,
        // Keep existing stock quantity
        min_stock_level: editingPart.min_stock_level,
        // Keep existing min stock level
        supplier: formData.supplier,
        part_number: formData.part_number,
        hsn_code: formData.hsn_code
      });
    } else {
      onSubmit({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock_quantity: 0,
        // Default value for new parts
        min_stock_level: 0,
        // Default value for new parts
        supplier: formData.supplier || undefined,
        part_number: formData.part_number || undefined,
        hsn_code: formData.hsn_code || undefined,
        is_active: true
      });
    }
  };
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      supplier: "",
      part_number: "",
      hsn_code: ""
    });
  };
  const handleClose = () => {
    onClose();
    if (!editingPart) {
      resetForm();
    }
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="partName">Part Name *</Label>
            <Input id="partName" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} placeholder="Enter part name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partPrice">Price (₹) *</Label>
              <Input id="partPrice" type="number" value={formData.price} onChange={e => setFormData({
              ...formData,
              price: e.target.value
            })} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="partCategory">Category</Label>
              <Input id="partCategory" value={formData.category} onChange={e => setFormData({
              ...formData,
              category: e.target.value
            })} placeholder="e.g., Filters, Brake System" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partSupplier">Supplier</Label>
              <Input id="partSupplier" value={formData.supplier} onChange={e => setFormData({
              ...formData,
              supplier: e.target.value
            })} placeholder="Supplier name" />
            </div>
            <div>
              <Label htmlFor="partNumber">Part Number</Label>
              <Input id="partNumber" value={formData.part_number} onChange={e => setFormData({
              ...formData,
              part_number: e.target.value
            })} placeholder="Part number" />
            </div>
          </div>
          <div>
            <Label htmlFor="sacCode">HSN Code</Label>
            <Input id="sacCode" value={formData.hsn_code} onChange={e => setFormData({
            ...formData,
            hsn_code: e.target.value
          })} placeholder="e.g., 998313" />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? editingPart ? "Updating..." : "Adding..." : editingPart ? "Update Part" : "Add Part"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};
export default PartForm;