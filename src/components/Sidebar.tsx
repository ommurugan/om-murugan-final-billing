import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Receipt, Users, Wrench, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signOut
  } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems = [{
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard"
  }, {
    icon: Receipt,
    label: "Invoices",
    path: "/invoices"
  }, {
    icon: Users,
    label: "Customers",
    path: "/customers"
  }, {
    icon: Wrench,
    label: "Services",
    path: "/services"
  }, {
    icon: BarChart3,
    label: "Reports",
    path: "/reports"
  }];
  const isActive = (path: string) => location.pathname === path;
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return <div className={cn("bg-white border-r border-gray-200 transition-all duration-300 flex flex-col", isCollapsed ? "w-16" : "w-64")}>
      {/* Header with consistent styling */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <img src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" alt="OM MURUGAN AUTO WORKS" className="h-16 w-16" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">OM MURUGAN</h2>
                <p className="text-gray-600">AUTO WORKS</p>
              </div>
            </div>}
          {isCollapsed && <div className="flex justify-center w-full">
              <img src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" alt="OM MURUGAN AUTO WORKS" className="h-8 w-8" />
            </div>}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation with consistent font sizing */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => <Button key={item.path} variant={isActive(item.path) ? "default" : "ghost"} className={cn("w-full justify-start gap-3 h-10 font-medium", isActive(item.path) ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100", isCollapsed && "justify-center px-0")} onClick={() => navigate(item.path)}>
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </Button>)}
      </nav>

      {/* Footer with consistent positioning and styling */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        
        <Button variant="ghost" className={cn("w-full justify-start gap-3 h-10 font-medium text-red-600 hover:bg-red-50", isCollapsed && "justify-center px-0")} onClick={handleLogout}>
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>;
};
export default Sidebar;