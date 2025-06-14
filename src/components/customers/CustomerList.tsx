
import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "@/types/billing";
import CustomerListHeader from "./CustomerListHeader";
import CustomerListContent from "./CustomerListContent";

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
      <CustomerListHeader />
      <CardContent>
        <CustomerListContent
          customers={customers}
          filteredCustomers={filteredCustomers}
          editingCustomer={editingCustomer}
          onEditCustomer={onEditCustomer}
          onUpdateCustomer={onUpdateCustomer}
          onCancelEdit={onCancelEdit}
          onDeleteCustomer={onDeleteCustomer}
          onEditingCustomerChange={onEditingCustomerChange}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
};

export default CustomerList;
