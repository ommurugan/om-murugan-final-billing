
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail } from "lucide-react";

interface VehicleOwnerCardProps {
  owner: {
    name: string;
    phone?: string;
    email?: string;
  };
}

const VehicleOwnerCard = ({ owner }: VehicleOwnerCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Vehicle Owner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900">{owner.name}</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-700">
                {owner.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{owner.phone}</span>
                  </div>
                )}
                {owner.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{owner.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleOwnerCard;
