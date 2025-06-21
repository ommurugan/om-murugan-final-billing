
import GSTInvoiceHeader from "./GSTInvoiceHeader";
import GSTInvoiceStats from "./GSTInvoiceStats";
import GSTInvoiceFilters from "./GSTInvoiceFilters";
import GSTInvoiceList from "./GSTInvoiceList";
import { InvoiceWithDetails } from "@/types/invoiceWithDetails";

interface GSTInvoiceManagementContentProps {
  filteredInvoices: InvoiceWithDetails[];
  invoiceStats: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalRevenue: number;
  };
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  onCreateInvoice: () => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onView: (invoice: InvoiceWithDetails) => void;
  onEdit: (invoice: InvoiceWithDetails) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: InvoiceWithDetails) => void;
  onCreateFirst: () => void;
  getCustomerName: (invoice: InvoiceWithDetails) => string;
  getCustomerGST: (invoice: InvoiceWithDetails) => string;
  getVehicleInfo: (invoice: InvoiceWithDetails) => string;
}

const GSTInvoiceManagementContent = ({
  filteredInvoices,
  invoiceStats,
  searchTerm,
  statusFilter,
  dateFilter,
  onCreateInvoice,
  onSearchChange,
  onStatusFilterChange,
  onDateFilterChange,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onCreateFirst,
  getCustomerName,
  getCustomerGST,
  getVehicleInfo
}: GSTInvoiceManagementContentProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <GSTInvoiceHeader onCreateInvoice={onCreateInvoice} />
      
      <GSTInvoiceStats {...invoiceStats} />
      
      <GSTInvoiceFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
        onDateFilterChange={onDateFilterChange}
      />
      
      <GSTInvoiceList
        invoices={filteredInvoices}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onPrint={onPrint}
        onCreateFirst={onCreateFirst}
        getCustomerName={getCustomerName}
        getCustomerGST={getCustomerGST}
        getVehicleInfo={getVehicleInfo}
      />
    </div>
  );
};

export default GSTInvoiceManagementContent;
