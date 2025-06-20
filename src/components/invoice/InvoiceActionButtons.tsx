
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Receipt, Printer } from "lucide-react";

interface InvoiceActionButtonsProps {
  onSaveDraft: () => void;
  onCreateInvoice: () => void;
  onPrintPreview: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  showSaveDraft?: boolean;
  hideEmailButton?: boolean; // Add this prop to hide email functionality
}

const InvoiceActionButtons = ({
  onSaveDraft,
  onCreateInvoice,
  onPrintPreview,
  onCancel,
  isLoading = false,
  showSaveDraft = true,
  hideEmailButton = true // Default to true to hide email button
}: InvoiceActionButtonsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          {showSaveDraft && (
            <Button onClick={onSaveDraft} variant="outline" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
          )}
          <Button onClick={onCreateInvoice} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            <Receipt className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
          <Button onClick={onPrintPreview} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Preview
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceActionButtons;
