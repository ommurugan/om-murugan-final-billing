
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface InvoiceItem {
  id: string;
  type: 'service' | 'part';
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface GSTServicesPartsSectionProps {
  invoiceItems: InvoiceItem[];
  services: any[];
  parts: any[];
  onAddService: () => void;
  onAddPart: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateDiscount: (id: string, discount: number) => void;
  onItemSelect: (itemId: string, value: string) => void;
  onUnitPriceChange: (itemId: string, price: number) => void;
}

const GSTServicesPartsSection = ({
  invoiceItems,
  services,
  parts,
  onAddService,
  onAddPart,
  onRemoveItem,
  onUpdateQuantity,
  onUpdateDiscount,
  onItemSelect,
  onUnitPriceChange
}: GSTServicesPartsSectionProps) => {
  const handleTypeChange = (itemId: string, type: 'service' | 'part') => {
    // This would need to be handled in the parent component
    console.log('Type change:', itemId, type);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={onAddService} variant="outline">Add Service</Button>
        <Button onClick={onAddPart} variant="outline">Add Part</Button>
      </div>

      {invoiceItems.map((item, index) => (
        <div key={item.id} className="grid grid-cols-6 gap-2 items-end p-4 border rounded">
          <div>
            <Label>Type</Label>
            <Select 
              value={item.type} 
              onValueChange={(value: 'service' | 'part') => handleTypeChange(item.id, value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="part">Part</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Item</Label>
            <Select 
              value={item.itemId} 
              onValueChange={(value) => onItemSelect(item.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${item.type}`} />
              </SelectTrigger>
              <SelectContent>
                {(item.type === 'service' ? services : parts).map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name} - ₹{item.type === 'service' ? option.base_price : option.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
              min="1"
            />
          </div>

          <div>
            <Label>Unit Price</Label>
            <Input
              type="number"
              value={item.unitPrice}
              onChange={(e) => onUnitPriceChange(item.id, Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Discount</Label>
            <Input
              type="number"
              value={item.discount}
              onChange={(e) => onUpdateDiscount(item.id, Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label>Total</Label>
              <div className="text-lg font-semibold">₹{item.total.toFixed(2)}</div>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRemoveItem(item.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GSTServicesPartsSection;
