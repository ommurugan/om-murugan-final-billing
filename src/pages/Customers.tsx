
import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import StandardHeader from "@/components/StandardHeader";
import { useCustomers } from "@/hooks/useCustomers";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import { useDeleteCustomer } from "@/hooks/useDeleteCustomer";
import CustomerSearch from "@/components/customers/CustomerSearch";
import CustomerStats from "@/components/customers/CustomerStats";
import CustomerList from "@/components/customers/CustomerList";
import { Customer } from "@/types/billing";
import { useFilterParams } from "@/hooks/useFilterParams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { filterParams, clearFilters } = useFilterParams();
  
  const { data: customers = [], isLoading } = useCustomers();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  // Apply URL parameter filters
  useEffect(() => {
    // You can add specific customer filtering logic here based on URL params
    // For now, we'll just show all customers but display the filter badges
  }, [filterParams]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const hasFilters = Object.values(filterParams).some(value => value !== null);

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer({...customer});
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;
    
    try {
      await updateCustomerMutation.mutateAsync(editingCustomer);
      setEditingCustomer(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomerMutation.mutateAsync(customerId);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  const handleEditingCustomerChange = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  if (isLoading) {
    return (
      <StandardHeader title="Customers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StandardHeader>
    );
  }

  return (
    <StandardHeader title="Customers">
      <div className="w-full">
        <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-full">
          {/* Filter indicators */}
          {hasFilters && (
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filterParams.status && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filterParams.status}
                </Badge>
              )}
              {filterParams.type && (
                <Badge variant="secondary" className="gap-1">
                  Type: {filterParams.type}
                </Badge>
              )}
              {filterParams.date && (
                <Badge variant="secondary" className="gap-1">
                  Date: {filterParams.date}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3">
              <CustomerSearch 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            <div>
              <CustomerStats totalCustomers={customers.length} />
            </div>
          </div>

          {/* Customers List */}
          <CustomerList
            customers={customers}
            filteredCustomers={filteredCustomers}
            editingCustomer={editingCustomer}
            onEditCustomer={handleEditCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onCancelEdit={handleCancelEdit}
            onDeleteCustomer={handleDeleteCustomer}
            onEditingCustomerChange={handleEditingCustomerChange}
            isUpdating={updateCustomerMutation.isPending}
            isDeleting={deleteCustomerMutation.isPending}
          />
        </div>
      </div>
      
      <BottomNavigation />
    </StandardHeader>
  );
};

export default Customers;
