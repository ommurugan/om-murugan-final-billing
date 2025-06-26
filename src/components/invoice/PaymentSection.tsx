
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Payment } from "@/types/billing";

interface PaymentSectionProps {
  laborCharges: number;
  extraCharges: Array<{name: string; amount: number}>;
  discount: number;
  taxRate: number;
  notes: string;
  paymentMethod: Payment['method'];
  paymentAmount: number;
  onLaborChargesChange: (value: number) => void;
  onExtraChargesChange: (charges: Array<{name: string; amount: number}>) => void;
  onDiscountChange: (value: number) => void;
  onTaxRateChange: (value: number) => void;
  onNotesChange: (value: string) => void;
  onPaymentMethodChange: (method: Payment['method']) => void;
  onPaymentAmountChange: (amount: number) => void;
  subtotal: number;
  total: number;
  isGST?: boolean;
  hideExtraCharges?: boolean;
}

const PaymentSection = ({
  laborCharges,
  extraCharges,
  discount,
  taxRate,
  notes,
  paymentMethod,
  paymentAmount,
  onLaborChargesChange,
  onExtraChargesChange,
  onDiscountChange,
  onTaxRateChange,
  onNotesChange,
  onPaymentMethodChange,
  onPaymentAmountChange,
  subtotal,
  total,
  isGST = false,
  hideExtraCharges = false
}: PaymentSectionProps) => {
  const addExtraCharge = () => {
    onExtraChargesChange([...extraCharges, { name: "", amount: 0 }]);
  };

  const removeExtraCharge = (index: number) => {
    onExtraChargesChange(extraCharges.filter((_, i) => i !== index));
  };

  const updateExtraCharge = (index: number, field: 'name' | 'amount', value: string | number) => {
    const updated = extraCharges.map((charge, i) => 
      i === index ? { ...charge, [field]: value } : charge
    );
    onExtraChargesChange(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Additional Charges */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Charges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="laborCharges">Labor Charges (₹)</Label>
            <Input
              id="laborCharges"
              type="number"
              value={laborCharges}
              onChange={(e) => onLaborChargesChange(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          {!hideExtraCharges && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Extra Charges</Label>
                <Button size="sm" variant="outline" onClick={addExtraCharge}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {extraCharges.map((charge, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Charge name"
                    value={charge.name}
                    onChange={(e) => updateExtraCharge(index, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={charge.amount}
                    onChange={(e) => updateExtraCharge(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                    step="0.01"
                  />
                  <Button size="sm" variant="ghost" onClick={() => removeExtraCharge(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="taxRate">{isGST ? 'GST Rate (%)' : 'Tax Rate (%)'}</Label>
            {isGST ? (
              <Select value={taxRate.toString()} onValueChange={(value) => onTaxRateChange(parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => onTaxRateChange(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.01"
              />
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment & Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment & Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%):</span>
                <span>-₹{((subtotal * discount) / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{isGST ? 'GST' : 'Tax'} ({taxRate}%):</span>
              <span>₹{((subtotal - (subtotal * discount / 100)) * taxRate / 100).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentAmount">Payment Amount (₹)</Label>
            <Input
              id="paymentAmount"
              type="number"
              value={paymentAmount}
              onChange={(e) => onPaymentAmountChange(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSection;
