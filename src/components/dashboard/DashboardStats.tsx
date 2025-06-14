
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Car, Users, Receipt } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";

const DashboardStats = () => {
  const { data: invoices = [] } = useInvoices();
  const { data: customers = [] } = useCustomers();

  // Calculate real stats from actual data
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const todayRevenue = paidInvoices
    .filter(inv => new Date(inv.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const todayVehicles = invoices
    .filter(inv => new Date(inv.createdAt).toDateString() === new Date().toDateString())
    .length;

  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;

  const stats = [
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      change: todayRevenue > 0 ? "+100%" : "0%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Vehicles Serviced",
      value: todayVehicles.toString(),
      change: todayVehicles > 0 ? "+100%" : "0%",
      icon: Car,
      color: "text-blue-600"
    },
    {
      title: "Active Customers",
      value: customers.length.toString(),
      change: customers.length > 0 ? "+100%" : "0%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices.toString(),
      change: pendingInvoices > 0 ? "+100%" : "0%",
      icon: Receipt,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-500">Current total</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
