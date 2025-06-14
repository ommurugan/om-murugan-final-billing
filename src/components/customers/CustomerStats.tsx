
import { Card, CardContent } from "@/components/ui/card";

interface CustomerStatsProps {
  totalCustomers: number;
}

const CustomerStats = ({ totalCustomers }: CustomerStatsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerStats;
