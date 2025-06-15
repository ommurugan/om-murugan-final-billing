
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package } from "lucide-react";
import { Part } from "@/hooks/useParts";

interface PartCardProps {
  part: Part;
  onEdit: (part: Part) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const PartCard = ({ part, onEdit, onDelete, isDeleting }: PartCardProps) => {
  const getStockColor = (stock: number, minLevel: number) => {
    if (stock > minLevel * 2) return 'bg-green-100 text-green-800';
    if (stock > minLevel) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
            <Button size="sm" variant="ghost" onClick={() => onEdit(part)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-red-600"
              onClick={() => onDelete(part.id)}
              disabled={isDeleting}
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
  );
};

export default PartCard;
