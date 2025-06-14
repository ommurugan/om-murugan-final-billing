
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, Receipt, Users, Car, BarChart3, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const MobileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard"
    },
    {
      icon: Receipt,
      label: "Invoices",
      path: "/invoices"
    },
    {
      icon: Users,
      label: "Customers",
      path: "/customers"
    },
    {
      icon: Car,
      label: "Vehicles",
      path: "/vehicles"
    },
    {
      icon: BarChart3,
      label: "Reports",
      path: "/reports"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close sidebar when clicking outside or on page content
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Don't close if clicking on the trigger button or inside the sidebar
      if (target.closest('[data-sidebar="trigger"]') || 
          target.closest('[data-sidebar="sidebar"]') ||
          target.closest('.sheet-content')) {
        return;
      }
      
      // Close sidebar if it's open and clicking anywhere else
      if (isOpen) {
        setIsOpen(false);
      }
    };

    // Add event listener when sidebar is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const SidebarContent = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <img 
                src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
                alt="OM MURUGAN AUTO WORKS" 
                className="h-10 w-10" 
              />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">OM MURUGAN</h2>
              <p className="text-gray-600 text-sm">AUTO WORKS</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg transition-all duration-200 touch-manipulation active:scale-95",
                    "min-h-[52px] text-base font-medium",
                    isActive(item.path)
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
        
        {/* Footer with Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 active:bg-red-100 touch-manipulation active:scale-95 min-h-[52px] text-base font-medium"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-4 left-4 z-30 bg-white shadow-md border h-12 w-12 touch-manipulation active:scale-95"
            data-sidebar="trigger"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 z-40 sheet-content" data-sidebar="sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
