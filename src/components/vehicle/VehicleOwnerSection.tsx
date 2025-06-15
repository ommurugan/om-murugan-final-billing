
import { User, Phone, Mail } from "lucide-react";

interface VehicleOwnerSectionProps {
  owner: {
    name: string;
    phone?: string;
    email?: string;
  };
}

const VehicleOwnerSection = ({ owner }: VehicleOwnerSectionProps) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">Vehicle Owner</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-blue-900">{owner.name}</h4>
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
  );
};

export default VehicleOwnerSection;
