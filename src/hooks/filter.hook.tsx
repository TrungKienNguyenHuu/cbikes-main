import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_MAX_PRICE } from "../common/constants";
import { Bike, Category, FilterState } from "../common/types";
import { fetchBikesFromAPI } from "../services/bikeService";

export const useFilter = () => {
  const [filterState, setFilterState] = useState<FilterState>({
    currentCategory: Category.all,
    maxPrice: DEFAULT_MAX_PRICE,
  });

  const [bikesList, setBikesList] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bikes from API on component mount
  useEffect(() => {
    const loadBikes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bikes = await fetchBikesFromAPI();
        console.log("✓ Bikes fetched from API:", bikes);
        console.log("✓ Number of bikes:", bikes.length);
        setBikesList(bikes);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load bikes";
        setError(errorMessage);
        console.error("✗ Error loading bikes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBikes();
  }, []);

  const filteredBikesList = useMemo(
    () => {
      console.log("🔍 Starting filter with bikesList:", bikesList);
      
      const result = bikesList.filter((bike) => {
        const price = bike.price <= filterState.maxPrice;
        const type =
          bike.category === filterState.currentCategory ||
          filterState.currentCategory === "all";
        
        console.log(`  Bike: ${bike.name} | price: ${bike.price} (${price}) | category: ${bike.category} (${type})`);

        return price && type;
      });
      
      console.log("🔍 Filter Debug:", {
        totalBikes: bikesList.length,
        filteredBikes: result.length,
        currentCategory: filterState.currentCategory,
        maxPrice: filterState.maxPrice,
        result: result
      });
      
      return result;
    },
    [filterState.currentCategory, filterState.maxPrice, bikesList]
  );

  const handleCurrentCategory = useCallback(
    (categoryId: string) =>
      setFilterState((prev) => ({ ...prev, currentCategory: categoryId })),
    []
  );

  const handleMaxPrice = useCallback(
    (maxPrice: string) =>
      setFilterState((prev) => ({ ...prev, maxPrice: Number(maxPrice) })),
    []
  );

  return {
    filterState,
    filteredBikesList,
    handleCurrentCategory,
    handleMaxPrice,
    isLoading,
    error,
  };
};
