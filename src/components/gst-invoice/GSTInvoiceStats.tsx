
import { Card, CardContent } from "@/components/ui/card";

interface GSTInvoiceStatsProps {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  totalRevenue: number;
}

const GSTInvoiceStats = ({ total, paid, pending, overdue, totalRevenue }: GSTInvoiceStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="text-center">
            <p className="text-lg md:text-2xl font-bold text-blue-600">{total}</p>
            <p className="text-xs md:text-sm text-gray-600">Total</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="text-center">
            <p className="text-lg md:text-2xl font-bold text-green-600">{paid}</p>
            <p className="text-xs md:text-sm text-gray-600">Paid</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="text-center">
            <p className="text-lg md:text-2xl font-bold text-yellow-600">{pending}</p>
            <p className="text-xs md:text-sm text-gray-600">Pending</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="text-center">
            <p className="text-lg md:text-2xl font-bold text-red-600">{overdue}</p>
            <p className="text-xs md:text-sm text-gray-600">Overdue</p>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-2 md:col-span-1">
        <CardContent className="pt-4 md:pt-6">
          <div className="text-center">
            <p className="text-lg md:text-2xl font-bold text-purple-600">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs md:text-sm text-gray-600">Revenue</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GSTInvoiceStats;
