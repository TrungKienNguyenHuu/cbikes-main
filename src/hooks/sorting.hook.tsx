import { useMemo } from "react";
import { Bike } from "../common/types";

export type SortType = "latest" | "price-asc" | "price-desc" | "popular" | "rating";

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

      case "popular":
        // Assuming popularity is reflected in initial order
        // In a real app, this would use a popularity score from the API
        return sortedBikes;

      case "rating":
        // Assuming bikes with specifications are higher rated
        return sortedBikes.sort((a, b) => {
          const aHasSpecs = a.specifications ? 1 : 0;
          const bHasSpecs = b.specifications ? 1 : 0;
          return bHasSpecs - aHasSpecs;
        });

      default:
        return sortedBikes;
    }
  }, [bikes, sortType]);
};
