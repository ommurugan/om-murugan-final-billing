
import { Customer } from "@/types/billing";
import CustomerCard from "./CustomerCard";
import CustomerEditForm from "./CustomerEditForm";
import CustomerEmptyState from "./CustomerEmptyState";

interface CustomerListContentProps {
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

const CustomerListContent = ({
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
}: CustomerListContentProps) => {
  if (filteredCustomers.length === 0) {
    return <CustomerEmptyState hasCustomers={customers.length > 0} />;
  }

  return (
    <div className="space-y-4">
      {filteredCustomers.map((customer) => (
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
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerListContent;
