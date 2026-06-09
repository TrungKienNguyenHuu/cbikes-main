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
    currentSeller: "all", // 👈 Ensure this matches your FilterState type
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

  // Dynamically count distinct brands from the raw bikes list
  const dynamicCategories = useMemo(() => {
    const allBrands = bikesList.map((bike) => bike.category);

    const distinctBrands = Array.from(
        new Set(allBrands.filter((brand) => brand && brand !== "all" && brand !== Category.all))
    );

    return distinctBrands.map((brand) => ({
      id: brand,
      name: brand.charAt(0).toUpperCase() + brand.slice(1),
    }));
  }, [bikesList]);

  // 👇 NEW: Dynamically count distinct sellers from the raw bikes list 👇
  const dynamicSellers = useMemo(() => {
    // Flatten all seller names into a single array
    const allSellers = bikesList.flatMap((bike) =>
        bike.sellers ? bike.sellers.map((s) => s.name) : []
    );

    // Remove duplicates and empties
    const distinctSellers = Array.from(
        new Set(allSellers.filter((seller) => seller && seller !== "all"))
    );

    // Format for the buttons
    return distinctSellers.map((seller) => ({
      id: seller,
      name: seller,
    }));
  }, [bikesList]);

  // Apply search
  const searchedBikes = useSearch(bikesList, searchTerm);

  // Apply sorting
  const sortedBikes = useSorting(searchedBikes, sortType);

  // Apply filtering
  const filteredBikesList = useMemo(
      () =>
          sortedBikes.filter((bike) => {
            const matchesPrice = bike.price <= filterState.maxPrice;

            const matchesCategory =
                filterState.currentCategory === Category.all ||
                filterState.currentCategory === "all" ||
                bike.category.toLowerCase() === filterState.currentCategory.toLowerCase();

            // 👇 NEW: Check if the bike has a seller that matches the selected seller 👇
            const matchesSeller =
                filterState.currentSeller === "all" ||
                (bike.sellers && bike.sellers.some(
                    (s) => s.name.toLowerCase() === filterState.currentSeller.toLowerCase()
                ));

            return matchesPrice && matchesCategory && matchesSeller;
          }),
      [filterState.currentCategory, filterState.maxPrice, filterState.currentSeller, sortedBikes]
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

  // 👇 NEW: Handle seller selection changes 👇
  const handleCurrentSeller = useCallback(
      (sellerId: string) => {
        setFilterState((prev) => ({ ...prev, currentSeller: sellerId }));
        setCurrentPage(1); // Reset to first page when seller changes
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
      currentSeller: "all", // 👈 Ensure seller resets to "all"
    });
    setSearchTerm("");
    setSortType("latest");
    setCurrentPage(1);
  }, []);

  return {
    filterState,
    filteredBikesList,
    paginatedBikes,
    dynamicCategories,
    dynamicSellers, // 👈 Export the sellers array
    handleCurrentCategory,
    handleCurrentSeller, // 👈 Export the seller handler
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