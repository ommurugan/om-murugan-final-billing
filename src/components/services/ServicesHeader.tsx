
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import UserProfileButton from "@/components/UserProfileButton";

interface ServicesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ServicesHeader = ({ searchTerm, onSearchChange }: ServicesHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Services & Parts</h1>
        <UserProfileButton />
      </div>
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search services and parts..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </header>
  );
};

export default ServicesHeader;
