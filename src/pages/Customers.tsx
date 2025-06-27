
import { useState } from "react";
import StandardLayout from "@/components/StandardLayout";
import { useCustomers } from "@/hooks/useCustomers";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import { useDeleteCustomer } from "@/hooks/useDeleteCustomer";
import CustomerSearch from "@/components/customers/CustomerSearch";
import CustomerStats from "@/components/customers/CustomerStats";
import CustomerList from "@/components/customers/CustomerList";
import { Customer } from "@/types/billing";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const { data: customers = [], isLoading } = useCustomers();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower))
    );
  });

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
      <StandardLayout title="Customers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Customers">
      <div className="p-4 md:p-6 pb-20 md:pb-6">
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
    </StandardLayout>
  );
};

export default Customers;
