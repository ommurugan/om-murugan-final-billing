
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Wrench, BarChart3 } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    { title: "New Invoice", icon: Plus, action: () => navigate('/invoices'), color: "bg-blue-600" },
    { title: "Customer", icon: Users, action: () => navigate('/customers'), color: "bg-green-600" },
    { title: "Manage Services", icon: Wrench, action: () => navigate('/services'), color: "bg-purple-600" },
    { title: "View Reports", icon: BarChart3, action: () => navigate('/reports'), color: "bg-orange-600" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used functions for faster workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-gray-50"
              onClick={action.action}
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
