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
  const {
    signOut
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
  const SidebarContent = () => {};
  return <>
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
    </>;
};
export default MobileSidebar;