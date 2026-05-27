import { useMemo } from "react";
import { Bike } from "../common/types";

export const useSearch = (bikes: Bike[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm.trim()) {
      return bikes;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return bikes.filter(
      (bike) =>
        bike.name.toLowerCase().includes(lowerSearch) ||
        (bike.specifications?.motorPower.toLowerCase().includes(lowerSearch))
    );
  }, [bikes, searchTerm]);
};
