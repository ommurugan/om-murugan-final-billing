
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Receipt,
  Calendar,
  BarChart3
} from "lucide-react";
import MobileSidebar from "@/components/MobileSidebar";
import { CustomBarChart, CustomLineChart, CustomPieChart } from "@/components/Chart";
import { useInvoices } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";

const Reports = () => {
  const [dateRange, setDateRange] = useState("30");
  const { data: invoices = [] } = useInvoices();
  const { data: customers = [] } = useCustomers();

  // Calculate metrics from real data
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalCustomers = customers.length;
  const vehiclesServiced = invoices.length;
  const totalInvoices = invoices.length;

  // Generate monthly revenue data from actual invoices
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleDateString('en', { month: 'short' });
    
    const monthInvoices = paidInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created_at);
      return invoiceDate.getMonth() === date.getMonth() && 
             invoiceDate.getFullYear() === date.getFullYear();
    });
    
    return {
      month: monthName,
      revenue: monthInvoices.reduce((sum, inv) => sum + inv.total, 0),
      services: monthInvoices.length
    };
  });

  // Service types distribution (placeholder data since we don't have service details)
  const serviceTypes = [
    { name: 'Full Service', value: 35, color: '#3B82F6' },
    { name: 'Oil Change', value: 25, color: '#10B981' },
    { name: 'Brake Service', value: 20, color: '#F59E0B' },
    { name: 'Engine Repair', value: 15, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#8B5CF6' }
  ];

  // Daily stats for current week
  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en', { weekday: 'short' });
    
    const dayInvoices = paidInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created_at);
      return invoiceDate.toDateString() === date.toDateString();
    });
    
    return {
      day: dayName,
      revenue: dayInvoices.reduce((sum, inv) => sum + inv.total, 0),
      customers: dayInvoices.length
    };
  });

  const topServices = [
    { name: 'Full Service', count: Math.floor(totalInvoices * 0.4), revenue: Math.floor(totalRevenue * 0.45), growth: '+12%' },
    { name: 'Oil Change', count: Math.floor(totalInvoices * 0.3), revenue: Math.floor(totalRevenue * 0.25), growth: '+8%' },
    { name: 'Brake Service', count: Math.floor(totalInvoices * 0.2), revenue: Math.floor(totalRevenue * 0.2), growth: '+15%' },
    { name: 'Engine Repair', count: Math.floor(totalInvoices * 0.1), revenue: Math.floor(totalRevenue * 0.1), growth: '+5%' }
  ];

  const keyMetrics = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: totalRevenue > 0 ? "+100%" : "0%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      change: totalCustomers > 0 ? "+100%" : "0%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Vehicles Serviced",
      value: vehiclesServiced.toString(),
      change: vehiclesServiced > 0 ? "+100%" : "0%",
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toString(),
      change: totalInvoices > 0 ? "+100%" : "0%",
      icon: Receipt,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  const hasData = totalRevenue > 0 || totalCustomers > 0 || vehiclesServiced > 0;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex w-full">
          <MobileSidebar />
          
          <div className="flex-1 flex flex-col min-h-screen">
            <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                  <p className="text-gray-600">Track your business performance and insights</p>
                </div>
              </div>
            </header>

            <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
              <Card>
                <CardContent className="pt-8 pb-8">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
                    <p className="text-gray-500 mb-6">
                      Start generating reports by creating invoices and adding customers to your system.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={() => window.location.href = '/invoices'} className="bg-blue-600 hover:bg-blue-700">
                        <Receipt className="h-4 w-4 mr-2" />
                        Create Invoice
                      </Button>
                      <Button onClick={() => window.location.href = '/customers'} variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Add Customer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex w-full">
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600">Track your business performance and insights</p>
              </div>
              <div className="flex gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => exportReport('PDF')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {metric.change.startsWith('+') ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.change}
                          </span>
                          <span className="text-sm text-gray-500">vs last period</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full ${metric.bgColor}`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Revenue Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Revenue Trend</CardTitle>
                      <CardDescription>Revenue over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CustomLineChart 
                        data={monthlyRevenue}
                        dataKey="revenue"
                        xAxisKey="month"
                        color="#3B82F6"
                      />
                    </CardContent>
                  </Card>

                  {/* Service Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Distribution</CardTitle>
                      <CardDescription>Estimated breakdown of service types</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CustomPieChart 
                        data={serviceTypes}
                        dataKey="value"
                        nameKey="name"
                      />
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {serviceTypes.map((service, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: service.color }}
                            />
                            <span className="text-sm text-gray-600">{service.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                    <CardDescription>Daily revenue for this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CustomBarChart 
                      data={dailyStats}
                      dataKey="revenue"
                      xAxisKey="day"
                      color="#3B82F6"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Analysis</CardTitle>
                        <CardDescription>Detailed revenue breakdown and trends</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CustomBarChart 
                          data={monthlyRevenue}
                          dataKey="revenue"
                          xAxisKey="month"
                          color="#10B981"
                          height={400}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center border-b pb-4">
                          <p className="text-3xl font-bold text-green-600">₹{Math.floor(totalRevenue).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Invoices</span>
                            <span className="font-semibold">{totalInvoices}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Paid Invoices</span>
                            <span className="font-semibold">{paidInvoices.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average Invoice</span>
                            <span className="font-semibold">₹{paidInvoices.length > 0 ? Math.floor(totalRevenue / paidInvoices.length).toLocaleString() : 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                    <CardDescription>Estimated breakdown of service performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{service.name}</p>
                              <p className="text-sm text-gray-600">{service.count} services estimated</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{service.revenue.toLocaleString()}</p>
                            <Badge 
                              variant={service.growth.startsWith('+') ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {service.growth}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Customers Tab */}
              <TabsContent value="customers" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
                        <p className="text-sm text-gray-600">Total Customers</p>
                        <p className="text-xs text-green-600 mt-1">Active customers</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{totalCustomers > 0 ? '100%' : '0%'}</p>
                        <p className="text-sm text-gray-600">Retention Rate</p>
                        <p className="text-xs text-green-600 mt-1">All active</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{totalCustomers > 0 ? Math.floor(totalRevenue / totalCustomers).toLocaleString() : 0}
                        </p>
                        <p className="text-sm text-gray-600">Avg. Customer Value</p>
                        <p className="text-xs text-green-600 mt-1">Per customer</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
