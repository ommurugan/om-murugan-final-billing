
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CustomerSearch = ({ searchTerm, onSearchChange }: CustomerSearchProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search customers by name, phone, email, or vehicle number..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSearch;
