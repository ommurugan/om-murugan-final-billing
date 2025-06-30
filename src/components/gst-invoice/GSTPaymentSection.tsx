
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface GSTPaymentSectionProps {
  laborCharges: number;
  discount: number;
  taxRate: number;
  paymentMethod: string;
  notes: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  onLaborChargesChange: (value: number) => void;
  onDiscountChange: (value: number) => void;
  onTaxRateChange: (value: number) => void;
  onPaymentMethodChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const GSTPaymentSection = ({
  laborCharges,
  discount,
  taxRate,
  paymentMethod,
  notes,
  subtotal,
  discountAmount,
  taxAmount,
  total,
  onLaborChargesChange,
  onDiscountChange,
  onTaxRateChange,
  onPaymentMethodChange,
  onNotesChange
}: GSTPaymentSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="labor-charges">Labor Charges</Label>
          <Input
            id="labor-charges"
            type="number"
            value={laborCharges}
            onChange={(e) => onLaborChargesChange(Number(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            value={discount}
            onChange={(e) => onDiscountChange(Number(e.target.value))}
            max="100"
          />
        </div>

        <div>
          <Label htmlFor="tax-rate">GST Rate (%)</Label>
          <Input
            id="tax-rate"
            type="number"
            value={taxRate}
            onChange={(e) => onTaxRateChange(Number(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending Payment</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Additional notes for the invoice..."
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Discount ({discount}%):</span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>CGST ({(taxRate / 2).toFixed(1)}%):</span>
          <span>₹{(taxAmount / 2).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>SGST ({(taxRate / 2).toFixed(1)}%):</span>
          <span>₹{(taxAmount / 2).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold border-t pt-2">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        {paymentMethod === 'pending' && (
          <div className="text-orange-600 text-sm font-medium">
            Invoice will be marked as PENDING
          </div>
        )}
        {paymentMethod !== 'pending' && paymentMethod && (
          <div className="text-green-600 text-sm font-medium">
            Invoice will be marked as PAID
          </div>
        )}
      </div>
    </div>
  );
};

export default GSTPaymentSection;
