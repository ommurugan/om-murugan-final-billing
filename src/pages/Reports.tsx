
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Car,
  TrendingUp,
  Calendar
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import VehicleSearch from "@/components/VehicleSearch";

const Reports = () => {
  // Sample data for demonstration
  const monthlyRevenue = [
    { month: "Jan", revenue: 45000, invoices: 45 },
    { month: "Feb", revenue: 52000, invoices: 52 },
    { month: "Mar", revenue: 48000, invoices: 48 },
    { month: "Apr", revenue: 61000, invoices: 61 },
    { month: "May", revenue: 55000, invoices: 55 },
    { month: "Jun", revenue: 67000, invoices: 67 },
  ];

  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const totalInvoices = monthlyRevenue.reduce((sum, item) => sum + item.invoices, 0);
  const avgInvoiceValue = totalRevenue / totalInvoices;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          </div>
        </header>

        <div className="p-4 md:p-6 pb-20 md:pb-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="search">Vehicle Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                        <p className="text-2xl font-bold">{totalInvoices}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Invoice Value</p>
                        <p className="text-2xl font-bold">₹{Math.round(avgInvoiceValue).toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Customers</p>
                        <p className="text-2xl font-bold">128</p>
                      </div>
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Revenue Trend
                  </CardTitle>
                  <CardDescription>Revenue and invoice count over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyRevenue.map((item, index) => (
                      <div key={item.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{item.month} 2024</p>
                            <p className="text-sm text-gray-600">{item.invoices} invoices</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{item.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">
                            ₹{Math.round(item.revenue / item.invoices).toLocaleString()} avg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Services</CardTitle>
                  <CardDescription>Most requested services this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Oil Change", count: 45, percentage: 35 },
                      { name: "Brake Service", count: 32, percentage: 25 },
                      { name: "Engine Tune-up", count: 28, percentage: 22 },
                      { name: "Tire Replacement", count: 23, percentage: 18 }
                    ].map((service) => (
                      <div key={service.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Car className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${service.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{service.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="search">
              <VehicleSearch />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Reports;
