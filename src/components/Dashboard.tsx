
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomLineChart } from "./Chart";
import { useInvoicesWithDetails } from "@/hooks/useInvoicesWithDetails";
import { useState } from "react";
import InvoiceViewModal from "./invoice/InvoiceViewModal";
import ProfessionalInvoicePrint from "./ProfessionalInvoicePrint";
import { Invoice, Customer, Vehicle } from "@/types/billing";

const Dashboard = () => {
  const { data: recentInvoices = [] } = useInvoicesWithDetails();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Mock data for dashboard cards
  const stats = {
    totalRevenue: 125000,
    activeCustomers: 45,
    vehiclesServiced: 78,
    pendingInvoices: 12
  };

  const chartData = [
    { name: 'Jan', revenue: 25000 },
    { name: 'Feb', revenue: 30000 },
    { name: 'Mar', revenue: 28000 },
    { name: 'Apr', revenue: 32000 },
    { name: 'May', revenue: 35000 },
    { name: 'Jun', revenue: 40000 },
  ];

  const handleInvoiceClick = (invoice: any) => {
    console.log("Invoice clicked:", invoice);
    setSelectedInvoice(invoice);
    setSelectedCustomer(invoice.customer);
    setSelectedVehicle(invoice.vehicle);
    setShowInvoiceModal(true);
  };

  const handlePrintInvoice = () => {
    setShowInvoiceModal(false);
    setShowPrintPreview(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">+5 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Serviced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vehiclesServiced}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart 
              data={chartData} 
              dataKey="revenue" 
              xAxisKey="name" 
              color="#3B82F6" 
              height={300} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.slice(0, 5).map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleInvoiceClick(invoice)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-600">
                      {invoice.customer?.name || 'Loading...'} - {invoice.vehicle ? `${invoice.vehicle.make} ${invoice.vehicle.model}` : 'Loading...'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(invoice.createdAt)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                    <span className="font-semibold">₹{invoice.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {recentInvoices.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No recent invoices found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice View Modal */}
      {showInvoiceModal && selectedInvoice && selectedCustomer && selectedVehicle && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          customer={selectedCustomer}
          vehicle={selectedVehicle}
          onClose={() => setShowInvoiceModal(false)}
          onEdit={() => {
            // Navigate to edit page - implement this based on your routing
            setShowInvoiceModal(false);
          }}
          onPrint={handlePrintInvoice}
        />
      )}

      {/* Print Preview */}
      {showPrintPreview && selectedInvoice && selectedCustomer && selectedVehicle && (
        <ProfessionalInvoicePrint
          invoice={selectedInvoice}
          customer={selectedCustomer}
          vehicle={selectedVehicle}
          onClose={() => setShowPrintPreview(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
