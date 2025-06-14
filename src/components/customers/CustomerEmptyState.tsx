
interface CustomerEmptyStateProps {
  hasCustomers: boolean;
}

const CustomerEmptyState = ({ hasCustomers }: CustomerEmptyStateProps) => {
  return (
    <div className="text-center py-8 text-gray-500">
      {hasCustomers ? "No customers found matching your search." : "No customers found. Add your first customer to get started."}
    </div>
  );
};

export default CustomerEmptyState;
