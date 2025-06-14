
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Car, Users, Receipt } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";
import { useVehicles } from "@/hooks/useVehicles";
import { useNavigate } from "react-router-dom";

const DashboardStats = () => {
  const navigate = useNavigate();
  const { data: invoices = [] } = useInvoices();
  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();

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
      color: "text-green-600",
      bgColor: "bg-green-50",
      onClick: () => navigate('/invoices?status=paid&date=today')
    },
    {
      title: "Vehicles Serviced",
      value: vehicles.length.toString(),
      change: vehicles.length > 0 ? "+100%" : "0%",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => navigate('/vehicles')
    },
    {
      title: "Active Customers",
      value: customers.length.toString(),
      change: customers.length > 0 ? "+100%" : "0%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: () => navigate('/customers')
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices.toString(),
      change: pendingInvoices > 0 ? "+100%" : "0%",
      icon: Receipt,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: () => navigate('/invoices?status=pending')
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 touch-manipulation active:scale-95" 
          onClick={stat.onClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 leading-tight">
              {stat.title}
            </CardTitle>
            <div className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-500">Tap to view details</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
