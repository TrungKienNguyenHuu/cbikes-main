import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_MAX_PRICE } from "../common/constants";
import { Bike, Category, FilterState } from "../common/types";
import { fetchBikesFromAPI } from "../services/bikeService";
import { useSorting, SortType } from "./sorting.hook";
import { useSearch } from "./search.hook";

export const useFilter = () => {
  const [filterState, setFilterState] = useState<FilterState>({
    currentCategory: Category.all,
    maxPrice: DEFAULT_MAX_PRICE,
  });

  const [bikesList, setBikesList] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<SortType>("latest");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Apply search
  const searchedBikes = useSearch(bikesList, searchTerm);

  // Apply sorting
  const sortedBikes = useSorting(searchedBikes, sortType);

  // Apply filtering
  const filteredBikesList = useMemo(
    () => {
      console.log("🔍 Starting filter with bikesList:", sortedBikes);
      
      const result = sortedBikes.filter((bike) => {
        const price = bike.price <= filterState.maxPrice;
        const type =
          bike.category === filterState.currentCategory ||
          filterState.currentCategory === "all";
        
        console.log(`  Bike: ${bike.name} | price: ${bike.price} (${price}) | category: ${bike.category} (${type})`);

        return price && type;
      });
      
      console.log("🔍 Filter Debug:", {
        totalBikes: sortedBikes.length,
        filteredBikes: result.length,
        currentCategory: filterState.currentCategory,
        maxPrice: filterState.maxPrice,
        result: result
      });
      
      return result;
    },
    [filterState.currentCategory, filterState.maxPrice, sortedBikes]
  );

  // Pagination
  const totalPages = Math.ceil(filteredBikesList.length / itemsPerPage);
  const paginatedBikes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBikesList.slice(startIndex, endIndex);
  }, [filteredBikesList, currentPage, itemsPerPage]);

  const handleCurrentCategory = useCallback(
    (categoryId: string) => {
      setFilterState((prev) => ({ ...prev, currentCategory: categoryId }));
      setCurrentPage(1); // Reset to first page when category changes
    },
    []
  );

  const handleMaxPrice = useCallback(
    (maxPrice: string) => {
      setFilterState((prev) => ({ ...prev, maxPrice: Number(maxPrice) }));
      setCurrentPage(1); // Reset to first page when price changes
    },
    []
  );

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleSort = useCallback((sort: SortType) => {
    setSortType(sort);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, []);

  const handleItemsPerPage = useCallback((count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset to first page when items per page changes
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState({
      currentCategory: Category.all,
      maxPrice: DEFAULT_MAX_PRICE,
    });
    setSearchTerm("");
    setSortType("latest");
    setCurrentPage(1);
  }, []);

  return {
    filterState,
    filteredBikesList,
    paginatedBikes,
    handleCurrentCategory,
    handleMaxPrice,
    isLoading,
    error,
    searchTerm,
    handleSearch,
    sortType,
    handleSort,
    itemsPerPage,
    handleItemsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    resetFilters,
  };
};
