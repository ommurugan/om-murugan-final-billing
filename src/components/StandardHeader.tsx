
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StandardHeaderProps {
  title: string;
  children: React.ReactNode;
}

const StandardHeader = ({ title, children }: StandardHeaderProps) => {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
                alt="OM MURUGAN AUTO WORKS" 
                className="h-10 w-10 mr-3"
              />
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default StandardHeader;
