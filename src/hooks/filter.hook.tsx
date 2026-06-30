import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE, PRICE_RANGE_PRESETS } from "../common/constants";
import { Bike, FilterState } from "../common/types";
import { fetchBikesFromAPI, fetchMetadataFromAPI } from "../services/bikeService";
import { recordProductClick } from "../services/hotProductsService";
import { getOrCreateSessionId } from "../utils/session";
import { SortType } from "./sorting.hook";

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
  const [dynamicCategories, setDynamicCategories] = useState<{id: string, name: string}[]>([]);
  const [dynamicSellers, setDynamicSellers] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<SortType>("updated-asc");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const searchSessionId = useMemo(() => getOrCreateSessionId(), []);
  const lastRecordedSearchTerm = useRef("");
  
  // Track previous values for instant pagination
  const prevPageRef = useRef(currentPage);
  const prevSortRef = useRef(sortType);
  const prevItemsRef = useRef(itemsPerPage);

  // Load metadata (categories and sellers) on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchMetadataFromAPI();
        setDynamicCategories(data.dynamicCategories || []);
        setDynamicSellers(data.dynamicSellers || []);
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    };
    loadMetadata();
  }, []);

  // Fetch bikes from API whenever filters, pagination, or sorting changes
  useEffect(() => {
    const loadBikes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params: Record<string, any> = {
          page: currentPage,
          limit: itemsPerPage,
          sort: sortType,
        };

        if (searchTerm) params.search = searchTerm;
        if (filterState.currentCategory !== "all") params.category = filterState.currentCategory;
        if (filterState.currentSeller !== "all") params.seller = filterState.currentSeller;
        if (filterState.currentNeed !== "all") params.need = filterState.currentNeed;
        if (filterState.currentTier !== "all") params.tier = filterState.currentTier;
        
        if (filterState.minPrice > DEFAULT_MIN_PRICE) params.minPrice = filterState.minPrice;
        if (filterState.maxPrice < DEFAULT_MAX_PRICE) params.maxPrice = filterState.maxPrice;

        const { bikes, totalPages: fetchedTotalPages } = await fetchBikesFromAPI(params);
        
        setBikesList(bikes);
        setTotalPages(fetchedTotalPages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load bikes";
        setError(errorMessage);
        console.error("✗ Error loading bikes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const isInstant =
      prevPageRef.current !== currentPage ||
      prevSortRef.current !== sortType ||
      prevItemsRef.current !== itemsPerPage;

    prevPageRef.current = currentPage;
    prevSortRef.current = sortType;
    prevItemsRef.current = itemsPerPage;

    // Debounce search/filters, but fetch instantly for pagination/sorting
    const timer = setTimeout(loadBikes, isInstant ? 0 : 300);
    return () => clearTimeout(timer);
  }, [
    currentPage, itemsPerPage, sortType, searchTerm, 
    filterState.currentCategory, filterState.currentSeller, 
    filterState.currentNeed, filterState.currentTier, 
    filterState.minPrice, filterState.maxPrice
  ]);

  // Record search-driven impressions on matched bikes
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm === lastRecordedSearchTerm.current) {
      return;
    }

    if (isLoading) {
      return; // Wait until loading finishes to record the actual matched bikes
    }

    lastRecordedSearchTerm.current = searchTerm;

    const matchingBikeIds = bikesList.map((bike) => bike.id);

    if (matchingBikeIds.length === 0) {
      return;
    }

    Promise.all(
      matchingBikeIds.map((bikeId) => recordProductClick(bikeId, searchSessionId))
    ).catch((err) => {
      console.warn("Failed to record search-driven product views:", err);
    });
  }, [searchTerm, bikesList, isLoading, searchSessionId]);

  // Handle filter changes
  const handleCurrentCategory = useCallback((categoryId: string) => {
    setFilterState((prev) => ({ ...prev, currentCategory: categoryId }));
    setCurrentPage(1);
  }, []);

  const handleCurrentSeller = useCallback((sellerId: string) => {
    setFilterState((prev) => ({ ...prev, currentSeller: sellerId }));
    setCurrentPage(1);
  }, []);

  const handleCurrentNeed = useCallback((needId: string) => {
    setFilterState((prev) => ({ ...prev, currentNeed: needId }));
    setCurrentPage(1);
  }, []);

  const handleCurrentTier = useCallback((tierId: string) => {
    setFilterState((prev) => ({ ...prev, currentTier: tierId }));
    setCurrentPage(1);
  }, []);

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
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((sort: SortType) => {
    setSortType(sort);
    setCurrentPage(1);
  }, []);

  const handleItemsPerPage = useCallback((count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
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
    filteredBikesList: bikesList, // Aliased to not break components using this
    paginatedBikes: bikesList, // Aliased to not break components using this
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