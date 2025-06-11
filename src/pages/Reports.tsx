
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
  // Clear dummy data - start with empty arrays
  const monthlyRevenue = [];
  const totalRevenue = 0;
  const totalInvoices = 0;
  const avgInvoiceValue = 0;

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
                        <p className="text-2xl font-bold">₹{avgInvoiceValue.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Revenue Chart - Empty State */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Revenue Trend
                  </CardTitle>
                  <CardDescription>Revenue and invoice count over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>No revenue data available. Start creating invoices to see trends.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service Categories - Empty State */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Services</CardTitle>
                  <CardDescription>Most requested services this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>No service data available. Add services and create invoices to see popular services.</p>
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
