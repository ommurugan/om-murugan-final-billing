
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Car, 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Wrench, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

const MobileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Receipt, label: "Invoices", path: "/invoices" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Wrench, label: "Services", path: "/services" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm">OM MURUGAN</h2>
            <p className="text-xs text-gray-600">AUTO WORKS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-12 text-base",
              isActive(item.path) 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => handleNavigate(item.path)}
          >
            <item.icon className="h-6 w-6 flex-shrink-0" />
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-base text-gray-700 hover:bg-gray-100"
        >
          <Settings className="h-6 w-6 flex-shrink-0" />
          <span>Settings</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-base text-red-600 hover:bg-red-50"
          onClick={() => navigate('/')}
        >
          <LogOut className="h-6 w-6 flex-shrink-0" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button & Drawer */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-white shadow-md">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MobileSidebar;
