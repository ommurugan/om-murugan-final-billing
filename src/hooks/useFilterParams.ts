
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterParams = useMemo(() => ({
    status: searchParams.get('status'),
    type: searchParams.get('type'),
    date: searchParams.get('date'),
  }), [searchParams]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return {
    filterParams,
    updateFilter,
    clearFilters,
  };
};
