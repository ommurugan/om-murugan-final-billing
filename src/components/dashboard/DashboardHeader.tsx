
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar } from "lucide-react";
import { useState } from "react";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  return (
    <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-20 md:pt-4 relative z-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/invoices')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
