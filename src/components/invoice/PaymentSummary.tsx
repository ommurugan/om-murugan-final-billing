
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Receipt, CreditCard } from "lucide-react";
import { Payment } from "@/types/billing";

interface PaymentSummaryProps {
  subtotal: number;
  discount: number;
  taxRate: number;
  total: number;
  paymentMethod: Payment['method'];
  paymentAmount: number;
  onPaymentMethodChange: (method: Payment['method']) => void;
  onPaymentAmountChange: (amount: number) => void;
}

const PaymentSummary = ({
  subtotal,
  discount,
  taxRate,
  total,
  paymentMethod,
  paymentAmount,
  onPaymentMethodChange,
  onPaymentAmountChange
}: PaymentSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Payment & Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({discount}%):</span>
              <span>-₹{(subtotal * discount / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-500">
            <span>Tax (Non-GST):</span>
            <span>₹0.00</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Details
          </h4>
          
          <div>
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="netbanking">Net Banking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Payment Amount</Label>
            <Input
              type="number"
              value={paymentAmount}
              onChange={(e) => onPaymentAmountChange(parseFloat(e.target.value) || 0)}
              max={total}
            />
            {paymentAmount < total && (
              <p className="text-sm text-orange-600 mt-1">
                Partial payment: ₹{(total - paymentAmount).toFixed(2)} remaining
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
