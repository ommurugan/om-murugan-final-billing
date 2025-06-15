
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import MobileInvoiceList from "@/components/mobile/MobileInvoiceList";
import StandardHeader from "@/components/StandardHeader";
import { InvoiceManagement } from "@/components/InvoiceManagement";

const Invoices = () => {
  const { isNative } = useMobileFeatures();

  // Use mobile layout for native apps and small screens
  if (isNative || window.innerWidth < 768) {
    return <MobileInvoiceList />;
  }

  // Use desktop layout for larger screens
  return (
    <StandardHeader title="Invoices">
      <div className="p-6">
        <InvoiceManagement />
      </div>
    </StandardHeader>
  );
};

export default Invoices;
