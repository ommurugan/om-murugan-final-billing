
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <MobileSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 space-y-6 relative z-0">
          {/* Stats Grid */}
          <DashboardStats />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <RecentActivity />
        </main>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
