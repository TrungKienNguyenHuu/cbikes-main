import { useMemo } from "react";
import { Bike } from "../common/types";

export const useSearch = (bikes: Bike[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm.trim()) {
      return bikes;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return bikes.filter((bike) => {
      // Search by product name
      const matchesName = bike.name.toLowerCase().includes(lowerSearch);
      
      // Also search by motor power specifications if available
      const matchesMotorPower =
        bike.specifications?.motorPower?.toLowerCase().includes(lowerSearch) ?? false;
      
      return matchesName || matchesMotorPower;
    });
  }, [bikes, searchTerm]);
};
