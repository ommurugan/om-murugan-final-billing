
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Invoice, Customer, Vehicle } from "@/types/billing";
import { InvoiceWithDetails } from "@/types/invoiceWithDetails";
import MobileInvoiceCard from "../MobileInvoiceCard";
import InvoiceStatsCards from "./InvoiceStatsCards";
import InvoiceFilters from "./InvoiceFilters";
import InvoiceList from "./InvoiceList";
import { useInvoiceStats } from "@/hooks/useInvoiceStats";
import { useInvoiceFilters } from "@/hooks/useInvoiceFilters";
import { useMemo } from "react";

interface NonGSTInvoiceContentProps {
  invoices: Invoice[];
  customers: Customer[];
  vehicles: Vehicle[];
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: Invoice) => void;
  onCreateFirst: () => void;
}

const NonGSTInvoiceContent = ({
  invoices,
  customers,
  vehicles,
  searchTerm,
  statusFilter,
  dateFilter,
  onSearchChange,
  onStatusFilterChange,
  onDateFilterChange,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onCreateFirst
}: NonGSTInvoiceContentProps) => {
  const invoiceStats = useInvoiceStats(invoices);

  // Transform Invoice[] to InvoiceWithDetails[] for the filter hook
  const invoicesWithDetails: InvoiceWithDetails[] = useMemo(() => {
    return invoices.map((invoice): InvoiceWithDetails => {
      const customer = customers.find(c => c.id === invoice.customerId) || null;
      const vehicle = vehicles.find(v => v.id === invoice.vehicleId) || null;
      
      return {
        ...invoice,
        customer,
        vehicle,
        customerName: customer?.name || "Unknown Customer",
        customerGST: customer?.gstNumber || "",
        vehicleInfo: vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle"
      };
    });
  }, [invoices, customers, vehicles]);

  const filteredInvoices = useInvoiceFilters({
    invoices: invoicesWithDetails,
    customers,
    searchTerm,
    statusFilter,
    dateFilter
  });

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || "Unknown Customer";
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <InvoiceStatsCards {...invoiceStats} />

      {/* Filters */}
      <InvoiceFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
        onDateFilterChange={onDateFilterChange}
      />

      {/* Desktop Invoices List */}
      <InvoiceList
        invoices={filteredInvoices}
        customers={customers}
        vehicles={vehicles}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onPrint={onPrint}
        onCreateFirst={onCreateFirst}
        showEmailButton={false}
      />

      {/* Mobile Invoices List */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Non-GST Invoices ({filteredInvoices.length})</h3>
        </div>
        
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No non-GST invoices found</p>
                <Button onClick={onCreateFirst} className="bg-blue-600 hover:bg-blue-700 w-full">
                  Create First Non-GST Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map(invoice => (
              <MobileInvoiceCard 
                key={invoice.id} 
                invoice={invoice} 
                customerName={getCustomerName(invoice.customerId)} 
                vehicleInfo={getVehicleInfo(invoice.vehicleId)} 
                onView={onView}
                onEdit={onEdit} 
                onDelete={onDelete} 
                onPrint={onPrint}
                showEmailButton={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NonGSTInvoiceContent;
