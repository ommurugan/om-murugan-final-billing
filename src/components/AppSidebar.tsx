
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, Receipt, Users, Wrench, BarChart3, LogOut } from "lucide-react";

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

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { setOpenMobile } = useSidebar();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setOpenMobile(false); // Close sidebar on mobile after navigation
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center space-x-3 p-4">
          <div className="p-2 bg-white rounded-lg">
            <img src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" alt="OM MURUGAN AUTO WORKS" className="h-12 w-12" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-base" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>OM MURUGAN</h2>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>AUTO WORKS</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    isActive={isActive(item.path)} 
                    onClick={() => handleNavigation(item.path)} 
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-md transition-colors ${
                      isActive(item.path) 
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
