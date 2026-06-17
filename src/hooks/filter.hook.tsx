import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE, PRICE_RANGE_PRESETS } from "../common/constants";
import { Bike, CategoryAll, FilterState } from "../common/types";
import { fetchBikesFromAPI } from "../services/bikeService";
import { useSorting, SortType } from "./sorting.hook";
import { useSearch } from "./search.hook";

export const useFilter = () => {
  const [filterState, setFilterState] = useState<FilterState>({
    currentCategory: "all",
    minPrice: DEFAULT_MIN_PRICE,
    maxPrice: DEFAULT_MAX_PRICE,
    pricePreset: "all",
    currentSeller: "all",
    currentNeed: "all",
    currentTier: "all",
  });

  const [bikesList, setBikesList] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<SortType>("updated-asc");
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
        new Set(allBrands.filter((brand) => brand && brand !== "all"))
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
            const matchesPrice =
                bike.price >= filterState.minPrice &&
                bike.price <= filterState.maxPrice;

            const matchesCategory =
                filterState.currentCategory === "all" ||
                bike.category.toLowerCase() === filterState.currentCategory.toLowerCase();

            const matchesSeller =
                filterState.currentSeller === "all" ||
                (bike.sellers && bike.sellers.some(
                    (s) => s.name.toLowerCase() === filterState.currentSeller.toLowerCase()
                ));

            // Check need filter (phân loại theo nhu cầu)
            const matchesNeed =
                filterState.currentNeed === "all" || 
                !filterState.currentNeed ||
                (bike.specifications && 
                 bike.specifications.need && 
                 bike.specifications.need.toLowerCase() === filterState.currentNeed?.toLowerCase());

            // Check tier filter (phân loại theo phân khúc)
            const matchesTier =
                filterState.currentTier === "all" || 
                !filterState.currentTier ||
                (bike.specifications && 
                 bike.specifications.tier && 
                 bike.specifications.tier.toLowerCase() === filterState.currentTier?.toLowerCase());

            return matchesPrice && matchesCategory && matchesSeller && matchesNeed && matchesTier;
          }),
      [filterState.currentCategory, filterState.minPrice, filterState.maxPrice, filterState.currentSeller, filterState.currentNeed, filterState.currentTier, sortedBikes]
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

  const handleCurrentNeed = useCallback(
      (needId: string) => {
        setFilterState((prev) => ({ ...prev, currentNeed: needId }));
        setCurrentPage(1); // Reset to first page when need changes
      },
      []
  );

  const handleCurrentTier = useCallback(
      (tierId: string) => {
        setFilterState((prev) => ({ ...prev, currentTier: tierId }));
        setCurrentPage(1); // Reset to first page when tier changes
      },
      []
  );

  const handlePricePreset = useCallback((presetId: string) => {
    if (presetId === "custom") {
      setFilterState((prev) => ({ ...prev, pricePreset: "custom" }));
      setCurrentPage(1);
      return;
    }

    const preset = PRICE_RANGE_PRESETS.find((item) => item.id === presetId);

    if (preset) {
      setFilterState((prev) => ({
        ...prev,
        pricePreset: presetId,
        minPrice: preset.min,
        maxPrice: preset.max,
      }));
      setCurrentPage(1);
    }
  }, []);

  const handleMinPrice = useCallback((minPrice: number) => {
    setFilterState((prev) => ({
      ...prev,
      pricePreset: "custom",
      minPrice: Math.min(minPrice, prev.maxPrice),
    }));
    setCurrentPage(1);
  }, []);

  const handleMaxPrice = useCallback((maxPrice: number) => {
    setFilterState((prev) => ({
      ...prev,
      pricePreset: "custom",
      maxPrice: Math.max(maxPrice, prev.minPrice),
    }));
    setCurrentPage(1);
  }, []);

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
      currentCategory: "all",
      minPrice: DEFAULT_MIN_PRICE,
      maxPrice: DEFAULT_MAX_PRICE,
      pricePreset: "all",
      currentSeller: "all",
      currentNeed: "all",
      currentTier: "all",
    });
    setSearchTerm("");
    setSortType("updated-asc");
    setCurrentPage(1);
  }, []);

  return {
    filterState,
    filteredBikesList,
    paginatedBikes,
    dynamicCategories,
    dynamicSellers,
    handleCurrentCategory,
    handleCurrentSeller,
    handleCurrentNeed,
    handleCurrentTier,
    handlePricePreset,
    handleMinPrice,
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