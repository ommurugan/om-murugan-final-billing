
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Wrench, 
  BarChart3
} from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Receipt, label: "Invoices", path: "/invoices" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Wrench, label: "Services", path: "/services" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    // Prevent event bubbling and ensure clean navigation
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 shadow-lg">
      <div className="flex justify-around items-center py-2 px-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNavigation(item.path);
            }}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-1 min-w-0 flex-1 text-xs font-medium transition-colors touch-manipulation",
              isActive(item.path)
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 mb-1",
              isActive(item.path) && "text-blue-600"
            )} />
            <span className="truncate text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
