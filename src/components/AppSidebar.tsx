
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Receipt, Users, Wrench, BarChart3, LogOut } from "lucide-react";

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

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 p-4">
          <div className="p-2 bg-white rounded-lg">
            <img 
              src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
              alt="OM MURUGAN AUTO WORKS" 
              className="h-12 w-12" 
            />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">OM MURUGAN</h2>
            <p className="text-gray-600 text-sm">AUTO WORKS</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
