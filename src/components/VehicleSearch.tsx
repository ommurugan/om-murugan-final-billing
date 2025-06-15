
import { useState } from "react";
import { useVehicleSearch } from "@/hooks/useVehicleSearch";
import VehicleSearchForm from "./vehicle/VehicleSearchForm";
import VehicleSearchResults from "./vehicle/VehicleSearchResults";

const VehicleSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const { data: searchResult, isLoading, error } = useVehicleSearch(searchTerm);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <div className="space-y-6">
      <VehicleSearchForm
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      
      <VehicleSearchResults
        searchResult={searchResult}
        searchTerm={searchTerm}
        isLoading={isLoading}
        error={error}
        hasSearched={hasSearched}
      />
    </div>
  );
};

export default VehicleSearch;
