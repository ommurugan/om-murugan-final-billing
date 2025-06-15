
import { useEffect, useState } from "react";
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import { useInvoiceStats } from "@/hooks/useInvoiceStats";
import MobileLayout from "./MobileLayout";
import MobileStats from "./MobileStats";
import MobileCard from "./MobileCard";
import MobileLoader from "./MobileLoader";
import PullToRefresh from "./PullToRefresh";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, Users, Wrench, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImpactStyle } from "@capacitor/haptics";

const MobileDashboard = () => {
  const { triggerHaptic, isOnline } = useMobileFeatures();
  const { stats, isLoading, refetch } = useInvoiceStats();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await triggerHaptic(ImpactStyle.Medium);
    await refetch();
    setRefreshing(false);
  };

  const handleQuickAction = async (action: () => void) => {
    await triggerHaptic(ImpactStyle.Light);
    action();
  };

  if (isLoading) {
    return (
      <MobileLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <MobileLoader text="Loading dashboard..." />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Dashboard">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="p-4 space-y-6">
          {/* Network Status */}
          {!isOnline && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm font-medium">You're offline. Some features may be limited.</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MobileStats
              title="Total Revenue"
              value={`₹${stats?.totalRevenue?.toFixed(2) || 0}`}
              icon={TrendingUp}
              color="green"
              trend={{ value: 12.5, isPositive: true }}
            />
            <MobileStats
              title="Invoices"
              value={stats?.totalInvoices || 0}
              icon={Receipt}
              color="blue"
              trend={{ value: 8.2, isPositive: true }}
            />
            <MobileStats
              title="Customers"
              value={stats?.totalCustomers || 0}
              icon={Users}
              color="purple"
              trend={{ value: 5.1, isPositive: true }}
            />
            <MobileStats
              title="Services"
              value={stats?.totalServices || 0}
              icon={Wrench}
              color="yellow"
              trend={{ value: -2.3, isPositive: false }}
            />
          </div>

          {/* Quick Actions */}
          <MobileCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 active:scale-95 transition-transform"
                onClick={() => handleQuickAction(() => navigate('/invoices'))}
              >
                <Plus className="h-6 w-6" />
                <span className="text-sm">New Invoice</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 active:scale-95 transition-transform"
                onClick={() => handleQuickAction(() => navigate('/customers'))}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Add Customer</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 active:scale-95 transition-transform"
                onClick={() => handleQuickAction(() => navigate('/services'))}
              >
                <Wrench className="h-6 w-6" />
                <span className="text-sm">Manage Services</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 active:scale-95 transition-transform"
                onClick={() => handleQuickAction(() => navigate('/reports'))}
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </MobileCard>

          {/* Recent Activity */}
          <MobileCard title="Recent Activity">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-sm">Invoice #INV-001 created</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <span className="text-green-600 font-medium">₹2,500</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-sm">New customer added</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
                <span className="text-blue-600 font-medium">Customer</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Service updated</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <span className="text-purple-600 font-medium">Service</span>
              </div>
            </div>
          </MobileCard>
        </div>
      </PullToRefresh>
    </MobileLayout>
  );
};

export default MobileDashboard;
