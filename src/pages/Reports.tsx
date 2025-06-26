import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  TrendingUp,
  IndianRupee
} from "lucide-react";
import StandardLayout from "@/components/StandardLayout";
import VehicleSearch from "@/components/VehicleSearch";
import { useInvoices } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const { data: invoices = [] } = useInvoices();
  const { data: customers = [] } = useCustomers();

  // Calculate real metrics from actual data
  const metrics = useMemo(() => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalInvoices = invoices.length;
    const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / paidInvoices.length : 0;
    const activeCustomers = customers.length;

    console.log('Reports calculations:', {
      totalRevenue,
      totalInvoices,
      avgInvoiceValue,
      activeCustomers,
      paidInvoices: paidInvoices.length
    });

    return {
      totalRevenue,
      totalInvoices,
      avgInvoiceValue,
      activeCustomers
    };
  }, [invoices, customers]);

  // Calculate monthly revenue for the last 6 months
  const monthlyRevenue = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      const monthlyInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate.getMonth() === date.getMonth() && 
               invDate.getFullYear() === date.getFullYear() &&
               inv.status === 'paid';
      });
      
      const revenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const count = monthlyInvoices.length;
      
      months.push({
        month: `${monthName} ${year}`,
        revenue,
        invoices: count
      });
    }
    
    return months;
  }, [invoices]);

  // Calculate popular services
  const popularServices = useMemo(() => {
    const serviceCount = new Map();
    
    invoices.forEach(invoice => {
      invoice.items?.forEach(item => {
        if (item.type === 'service') {
          const current = serviceCount.get(item.name) || 0;
          serviceCount.set(item.name, current + item.quantity);
        }
      });
    });
    
    return Array.from(serviceCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [invoices]);

  return (
    <StandardLayout title="Reports & Analytics">
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
                      <p className="text-2xl font-bold">₹{metrics.totalRevenue.toLocaleString()}</p>
                    </div>
                    <IndianRupee className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                      <p className="text-2xl font-bold">{metrics.totalInvoices}</p>
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
                      <p className="text-2xl font-bold">₹{Math.round(metrics.avgInvoiceValue).toLocaleString()}</p>
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
                      <p className="text-2xl font-bold">{metrics.activeCustomers}</p>
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
                {monthlyRevenue.some(month => month.revenue > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                          name === 'revenue' ? 'Revenue' : 'Invoices'
                        ]}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" name="revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No revenue data available. Start creating paid invoices to see trends.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Most requested services</CardDescription>
              </CardHeader>
              <CardContent>
                {popularServices.length > 0 ? (
                  <div className="space-y-4">
                    {popularServices.map((service, index) => (
                      <div key={service.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">{service.count}</span>
                          <span className="text-sm text-gray-500 ml-1">times</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No service data available. Add services and create invoices to see popular services.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="search">
            <VehicleSearch />
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
};

export default Reports;
