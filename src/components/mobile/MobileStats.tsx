
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileStatsProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  className?: string;
}

const MobileStats = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "blue",
  className 
}: MobileStatsProps) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    yellow: "bg-yellow-500 text-white",
    purple: "bg-purple-500 text-white"
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs mt-1 flex items-center gap-1",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
                <span className="text-gray-500">vs last month</span>
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-full",
            colorClasses[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileStats;
