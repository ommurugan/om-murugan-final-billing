
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface ExtraCharge {
  name: string;
  amount: number;
}

interface AdditionalChargesProps {
  laborCharges: number;
  extraCharges: ExtraCharge[];
  discount: number;
  taxRate: number;
  notes: string;
  onLaborChargesChange: (charges: number) => void;
  onExtraChargesChange: (charges: ExtraCharge[]) => void;
  onDiscountChange: (discount: number) => void;
  onTaxRateChange: (rate: number) => void;
  onNotesChange: (notes: string) => void;
}

const AdditionalCharges = ({
  laborCharges,
  extraCharges,
  discount,
  taxRate,
  notes,
  onLaborChargesChange,
  onExtraChargesChange,
  onDiscountChange,
  onTaxRateChange,
  onNotesChange
}: AdditionalChargesProps) => {
  const addExtraCharge = () => {
    onExtraChargesChange([...extraCharges, { name: "", amount: 0 }]);
  };

  const updateExtraCharge = (index: number, field: 'name' | 'amount', value: string | number) => {
    const updated = [...extraCharges];
    updated[index] = { ...updated[index], [field]: value };
    onExtraChargesChange(updated);
  };

  const removeExtraCharge = (index: number) => {
    onExtraChargesChange(extraCharges.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Charges</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Labor Charges</Label>
          <Input
            type="number"
            value={laborCharges}
            onChange={(e) => onLaborChargesChange(parseFloat(e.target.value) || 0)}
            placeholder="Enter labor charges"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Extra Charges</Label>
            <Button size="sm" variant="outline" onClick={addExtraCharge}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {extraCharges.map((charge, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                placeholder="Charge name"
                value={charge.name}
                onChange={(e) => updateExtraCharge(index, 'name', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={charge.amount}
                onChange={(e) => updateExtraCharge(index, 'amount', parseFloat(e.target.value) || 0)}
                className="w-32"
              />
              <Button size="sm" variant="ghost" onClick={() => removeExtraCharge(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Discount (%)</Label>
            <Input
              type="number"
              value={discount}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
            />
          </div>
          <div>
            <Label>Tax Rate (%)</Label>
            <Input
              type="number"
              value={taxRate}
              onChange={(e) => onTaxRateChange(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Additional notes"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalCharges;
