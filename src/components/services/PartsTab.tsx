
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { useParts, useDeletePart, Part } from "@/hooks/useParts";
import PartFormDialog from "./PartFormDialog";

interface PartsTabProps {
  searchTerm: string;
}

const PartsTab = ({ searchTerm }: PartsTabProps) => {
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  
  const { data: parts = [], isLoading: partsLoading } = useParts();
  const deletePartMutation = useDeletePart();

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePart = async (id: string) => {
    try {
      await deletePartMutation.mutateAsync(id);
      toast.success("Part deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete part");
      console.error("Error deleting part:", error);
    }
  };

  const getStockColor = (stock: number, minLevel: number) => {
    if (stock > minLevel * 2) return 'bg-green-100 text-green-800';
    if (stock > minLevel) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Parts Inventory</h2>
          <p className="text-gray-600">Manage your spare parts stock and pricing</p>
        </div>
        <PartFormDialog isAddForm={true} />
      </div>

      {partsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <Card key={part.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{part.name}</CardTitle>
                      <Badge className={getStockColor(part.stock_quantity, part.min_stock_level)}>
                        {part.stock_quantity} in stock
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <PartFormDialog
                      editingPart={editingPart}
                      onEditingChange={(part) => setEditingPart(part)}
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600"
                      onClick={() => handleDeletePart(part.id)}
                      disabled={deletePartMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-green-600">₹{part.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <Badge variant="outline">{part.category}</Badge>
                  </div>
                  {part.supplier && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Supplier:</span>
                      <span>{part.supplier}</span>
                    </div>
                  )}
                  {part.part_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Part #:</span>
                      <span className="font-mono text-xs">{part.part_number}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartsTab;
