
import { useMobileFeatures } from "@/hooks/useMobileFeatures";
import MobileDashboard from "@/components/mobile/MobileDashboard";
import StandardHeader from "@/components/StandardHeader";
import { Dashboard as DesktopDashboard } from "@/components/Dashboard";

const Dashboard = () => {
  const { isNative } = useMobileFeatures();

  // Use mobile layout for native apps and small screens
  if (isNative || window.innerWidth < 768) {
    return <MobileDashboard />;
  }

  // Use desktop layout for larger screens
  return (
    <StandardHeader title="Dashboard">
      <div className="p-6">
        <DesktopDashboard />
      </div>
    </StandardHeader>
  );
};

export default Dashboard;
