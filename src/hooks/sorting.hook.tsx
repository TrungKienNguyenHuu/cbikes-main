import { useMemo } from "react";
import { Bike } from "../common/types";

export type SortType = "latest" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "updated-asc" | "updated-desc" | "sellers-asc" | "sellers-desc";

export const useSorting = (bikes: Bike[], sortType: SortType) => {
  return useMemo(() => {
    const sortedBikes = [...bikes];

    switch (sortType) {
      case "price-asc":
        return sortedBikes.sort((a, b) => a.price - b.price);

      case "price-desc":
        return sortedBikes.sort((a, b) => b.price - a.price);

      case "latest":
        // Assuming newer bikes come later in the array, so reverse order
        return sortedBikes.reverse();

      case "name-asc":
        return sortedBikes.sort((a, b) => a.name.localeCompare(b.name));

      case "name-desc":
        return sortedBikes.sort((a, b) => b.name.localeCompare(a.name));

      case "updated-asc":
        return sortedBikes.sort((a, b) => {
          const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return dateA - dateB;
        });

      case "updated-desc":
        return sortedBikes.sort((a, b) => {
          const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return dateB - dateA;
        });

      case "sellers-asc":
        return sortedBikes.sort((a, b) => {
          const sellersA = a.sellers ? a.sellers.length : 0;
          const sellersB = b.sellers ? b.sellers.length : 0;
          return sellersA - sellersB;
        });

      case "sellers-desc":
        return sortedBikes.sort((a, b) => {
          const sellersA = a.sellers ? a.sellers.length : 0;
          const sellersB = b.sellers ? b.sellers.length : 0;
          return sellersB - sellersA;
        });

      default:
        return sortedBikes;
    }
  }, [bikes, sortType]);
};
