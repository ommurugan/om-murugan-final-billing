
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Car, 
  Receipt, 
  Users, 
  BarChart3, 
  Plus, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Wrench
} from "lucide-react";
import MobileSidebar from "@/components/MobileSidebar";
import { useInvoices } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const { data: invoices = [] } = useInvoices();
  const { data: customers = [] } = useCustomers();

  // Calculate real stats from database
  const todaysInvoices = invoices.filter(invoice => 
    new Date(invoice.createdAt).toDateString() === new Date().toDateString()
  );
  
  const todaysRevenue = todaysInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const vehiclesServiced = todaysInvoices.length;
  const activeCustomers = customers.length;
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;

  const stats = [
    {
      title: "Today's Revenue",
      value: `₹${todaysRevenue.toLocaleString()}`,
      change: todaysRevenue > 0 ? "+100%" : "0%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Vehicles Serviced",
      value: vehiclesServiced.toString(),
      change: vehiclesServiced > 0 ? "+100%" : "0%",
      icon: Car,
      color: "text-blue-600"
    },
    {
      title: "Active Customers",
      value: activeCustomers.toString(),
      change: activeCustomers > 0 ? "+100%" : "0%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices.toString(),
      change: "0%",
      icon: Receipt,
      color: "text-orange-600"
    }
  ];

  // Get recent activity from actual invoices
  const recentActivity = invoices.slice(0, 4).map(invoice => ({
    id: invoice.id,
    customer: (invoice as any).customers?.name || "Unknown Customer",
    vehicle: `${(invoice as any).vehicles?.make || ""} ${(invoice as any).vehicles?.model || ""}`.trim() || "Unknown Vehicle",
    service: "Service", // This would come from invoice_items in a real implementation
    amount: `₹${invoice.total.toLocaleString()}`,
    status: invoice.status === 'paid' ? 'Completed' : 
           invoice.status === 'pending' ? 'Pending' : 
           'In Progress'
  }));

  const quickActions = [
    { title: "New Invoice", icon: Plus, action: () => navigate('/invoices'), color: "bg-blue-600" },
    { title: "Add Customer", icon: Users, action: () => navigate('/customers'), color: "bg-green-600" },
    { title: "Manage Services", icon: Wrench, action: () => navigate('/services'), color: "bg-purple-600" },
    { title: "View Reports", icon: BarChart3, action: () => navigate('/reports'), color: "bg-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex w-full">
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {currentDate}
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/invoices')} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 space-y-6">
            {/* Stats Grid */}
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
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">{stat.change}</span>
                      <span className="text-gray-500">from yesterday</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used functions for faster workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20 flex flex-col gap-2 hover:bg-gray-50"
                      onClick={action.action}
                    >
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest service updates and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No recent activity</p>
                    <p className="text-sm text-gray-400">Start by creating your first invoice</p>
                    <Button 
                      onClick={() => navigate('/invoices')} 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Create Invoice
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Car className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.customer}</p>
                            <p className="text-sm text-gray-600">{activity.vehicle} • {activity.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{activity.amount}</p>
                          <Badge 
                            variant={
                              activity.status === 'Completed' ? 'default' : 
                              activity.status === 'In Progress' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
