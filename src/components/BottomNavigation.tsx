
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Car,
  BarChart3
} from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Receipt, label: "Invoices", path: "/invoices" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Car, label: "Vehicles", path: "/vehicles" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 shadow-lg safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-1 min-h-[68px]">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-1 min-w-0 flex-1 text-xs font-medium transition-all duration-200 touch-manipulation rounded-lg mx-1",
              "min-h-[56px] active:scale-95",
              isActive(item.path)
                ? "text-blue-600 bg-blue-50 shadow-sm"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-50 active:bg-gray-100"
            )}
          >
            <item.icon className={cn(
              "h-6 w-6 mb-1 transition-colors duration-200",
              isActive(item.path) ? "text-blue-600" : "text-gray-600"
            )} />
            <span className={cn(
              "truncate text-xs leading-tight",
              isActive(item.path) ? "text-blue-600 font-semibold" : "text-gray-600"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
