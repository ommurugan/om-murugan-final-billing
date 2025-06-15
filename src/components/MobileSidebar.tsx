
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, Receipt, Users, Wrench, BarChart3, LogOut, Menu } from "lucide-react";
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
      icon: Wrench,
      label: "Services",
      path: "/services"
    },
    {
      icon: BarChart3,
      label: "Reports",
      path: "/reports"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

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
          <h2 className="text-lg font-semibold">Menu</h2>
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
                    "flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
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
            className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg transition-colors text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-5 w-5" />
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
            className="fixed top-4 left-4 z-30 bg-white shadow-md border"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 z-40">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
