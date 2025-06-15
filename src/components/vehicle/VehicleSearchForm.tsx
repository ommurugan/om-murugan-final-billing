
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface VehicleSearchFormProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const VehicleSearchForm = ({ 
  searchTerm, 
  onSearchTermChange, 
  onSearch, 
  isLoading 
}: VehicleSearchFormProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Vehicle Search
        </CardTitle>
        <CardDescription>
          Search for vehicles by number to view service history and customer details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Enter vehicle number (e.g., TN 01 AB 1234)"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg"
            />
          </div>
          <Button 
            onClick={onSearch}
            disabled={!searchTerm.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSearchForm;
