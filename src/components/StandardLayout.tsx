
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import BottomNavigation from "./BottomNavigation";

interface StandardLayoutProps {
  title: string;
  children: ReactNode;
}

const StandardLayout = ({ title, children }: StandardLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="flex justify-between items-center px-4 md:px-6 py-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-8 w-8" />
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
              </div>
              
              {user && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 hidden md:block">Welcome, {user.email}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
        
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};

export default StandardLayout;
