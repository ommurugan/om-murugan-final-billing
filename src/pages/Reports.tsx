
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Receipt,
  Calendar,
  FileText
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const Reports = () => {
  const [dateRange, setDateRange] = useState("30");

  // Sample data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, services: 120 },
    { month: 'Feb', revenue: 52000, services: 140 },
    { month: 'Mar', revenue: 48000, services: 135 },
    { month: 'Apr', revenue: 61000, services: 165 },
    { month: 'May', revenue: 58000, services: 155 },
    { month: 'Jun', revenue: 67000, services: 180 }
  ];

  const serviceTypes = [
    { name: 'Full Service', value: 35, color: '#3B82F6' },
    { name: 'Oil Change', value: 25, color: '#10B981' },
    { name: 'Brake Service', value: 20, color: '#F59E0B' },
    { name: 'Engine Repair', value: 15, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#8B5CF6' }
  ];

  const dailyStats = [
    { day: 'Mon', revenue: 8500, customers: 12 },
    { day: 'Tue', revenue: 9200, customers: 15 },
    { day: 'Wed', revenue: 7800, customers: 11 },
    { day: 'Thu', revenue: 10200, customers: 16 },
    { day: 'Fri', revenue: 11500, customers: 18 },
    { day: 'Sat', revenue: 13200, customers: 22 },
    { day: 'Sun', revenue: 6500, customers: 8 }
  ];

  const topServices = [
    { name: 'Full Service', count: 45, revenue: 112500, growth: '+12%' },
    { name: 'Oil Change', count: 38, revenue: 30400, growth: '+8%' },
    { name: 'Brake Service', count: 22, revenue: 26400, growth: '+15%' },
    { name: 'Engine Repair', count: 18, revenue: 63000, growth: '+5%' },
    { name: 'Tire Service', count: 15, revenue: 7500, growth: '-2%' }
  ];

  const keyMetrics = [
    {
      title: "Total Revenue",
      value: "₹2,45,800",
      change: "+18.2%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Customers",
      value: "156",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Vehicles Serviced",
      value: "289",
      change: "+8.7%",
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Invoices",
      value: "234",
      change: "+15.3%",
      icon: Receipt,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const exportReport = (type) => {
    // Placeholder for export functionality
    console.log(`Exporting ${type} report...`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
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

        <div className="p-6 space-y-6">
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
                    <CardDescription>Revenue and service count over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                            name === 'revenue' ? 'Revenue' : 'Services'
                          ]}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Service Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Distribution</CardTitle>
                    <CardDescription>Breakdown of service types this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={serviceTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {serviceTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
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
                  <CardDescription>Daily revenue and customer count for this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                          name === 'revenue' ? 'Revenue' : 'Customers'
                        ]}
                      />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
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
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                          <Bar dataKey="revenue" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
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
                        <p className="text-3xl font-bold text-green-600">₹67,000</p>
                        <p className="text-sm text-gray-600">This Month</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Daily</span>
                          <span className="font-semibold">₹2,167</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Best Day</span>
                          <span className="font-semibold">₹13,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth Rate</span>
                          <span className="font-semibold text-green-600">+18.2%</span>
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
                  <CardTitle>Top Performing Services</CardTitle>
                  <CardDescription>Most popular services and their performance metrics</CardDescription>
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
                            <p className="text-sm text-gray-600">{service.count} services completed</p>
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
                      <p className="text-2xl font-bold text-blue-600">156</p>
                      <p className="text-sm text-gray-600">Total Customers</p>
                      <p className="text-xs text-green-600 mt-1">+12 new this month</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">89%</p>
                      <p className="text-sm text-gray-600">Retention Rate</p>
                      <p className="text-xs text-green-600 mt-1">+5% improvement</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">₹1,575</p>
                      <p className="text-sm text-gray-600">Avg. Customer Value</p>
                      <p className="text-xs text-green-600 mt-1">+8% increase</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Reports;
