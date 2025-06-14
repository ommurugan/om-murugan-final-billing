
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer } from "@/types/billing";
import CustomerCard from "./CustomerCard";
import CustomerEditForm from "./CustomerEditForm";

interface CustomerListProps {
  customers: Customer[];
  filteredCustomers: Customer[];
  editingCustomer: Customer | null;
  onEditCustomer: (customer: Customer) => void;
  onUpdateCustomer: () => void;
  onCancelEdit: () => void;
  onDeleteCustomer: (customerId: string) => void;
  onEditingCustomerChange: (customer: Customer) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const CustomerList = ({
  customers,
  filteredCustomers,
  editingCustomer,
  onEditCustomer,
  onUpdateCustomer,
  onCancelEdit,
  onDeleteCustomer,
  onEditingCustomerChange,
  isUpdating,
  isDeleting,
}: CustomerListProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Database</CardTitle>
        <CardDescription>Manage your customer information and service history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {customers.length === 0 ? "No customers found. Add your first customer to get started." : "No customers found matching your search."}
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id}>
                {editingCustomer && editingCustomer.id === customer.id ? (
                  <CustomerEditForm
                    customer={editingCustomer}
                    onSave={onUpdateCustomer}
                    onCancel={onCancelEdit}
                    onChange={onEditingCustomerChange}
                    isSaving={isUpdating}
                  />
                ) : (
                  <CustomerCard
                    customer={customer}
                    onEdit={onEditCustomer}
                    onDelete={onDeleteCustomer}
                    isDeleting={isDeleting}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
