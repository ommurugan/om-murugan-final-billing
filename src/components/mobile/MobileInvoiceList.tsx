
import { useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import MobileLayout from "./MobileLayout";
import MobileInvoiceCard from "../MobileInvoiceCard";
import MobileLoader from "./MobileLoader";
import PullToRefresh from "./PullToRefresh";
import MobileActionSheet from "./MobileActionSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Receipt } from "lucide-react";
import { Invoice } from "@/types/billing";

const MobileInvoiceList = () => {
  const { data: invoices, isLoading, refetch } = useInvoices();
  const { data: customers } = useCustomers();
  const { data: vehicles } = useVehicles();
  const { triggerHaptic } = useMobileFeatures();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredInvoices = invoices?.filter(invoice => {
    const customer = customers?.find(c => c.id === invoice.customerId);
    const searchMatch = !searchTerm || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || invoice.status === statusFilter;
    
    return searchMatch && statusMatch;
  }) || [];

  const getCustomerName = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId);
    return customer?.name || "Unknown Customer";
  };

  const getVehicleInfo = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId);
    if (!customer) return "No vehicle info";
    
    const vehicle = vehicles?.find(v => v.customer_id === customerId);
    return vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.vehicle_number}` : "No vehicle";
  };

  const handleEdit = (invoice: Invoice) => {
    // Navigate to edit invoice
    console.log("Edit invoice:", invoice);
  };

  const handleDelete = (invoiceId: string) => {
    // Handle delete invoice
    console.log("Delete invoice:", invoiceId);
  };

  const handlePrint = (invoice: Invoice) => {
    // Handle print invoice
    console.log("Print invoice:", invoice);
  };

  const handleEmail = (invoice: Invoice) => {
    // Handle email invoice
    console.log("Email invoice:", invoice);
  };

  if (isLoading) {
    return (
      <MobileLayout title="Invoices">
        <div className="flex items-center justify-center h-64">
          <MobileLoader text="Loading invoices..." />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Invoices">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="p-4 space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <MobileActionSheet
              trigger={
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              }
              title="Filter Invoices"
            >
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {["all", "draft", "pending", "paid", "overdue", "cancelled"].map((status) => (
                      <Badge
                        key={status}
                        variant={statusFilter === status ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => setStatusFilter(status)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </MobileActionSheet>
          </div>

          {/* Create Invoice Button */}
          <Button className="w-full" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create New Invoice
          </Button>

          {/* Invoice List */}
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-500">Create your first invoice to get started.</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <MobileInvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  customerName={getCustomerName(invoice.customerId)}
                  vehicleInfo={getVehicleInfo(invoice.customerId)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPrint={handlePrint}
                  onEmail={handleEmail}
                />
              ))
            )}
          </div>
        </div>
      </PullToRefresh>
    </MobileLayout>
  );
};

export default MobileInvoiceList;
