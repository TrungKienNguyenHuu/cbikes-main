import { useCallback, useState } from "react";
import { Bike } from "../common/types";
import { useToast } from "../context/ToastContext";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Bike[]>([]);
  const { addToast } = useToast();

  const isFavorite = useCallback(
    (bikeId: string) => favorites.some((bike) => bike.id === bikeId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (bike: Bike) => {
      setFavorites((prev) => {
        const exists = prev.some((item) => item.id === bike.id);
        if (exists) {
          addToast(`${bike.name} removed from favorites`, "info", 2000);
          return prev.filter((item) => item.id !== bike.id);
        }
        addToast(`${bike.name} added to favorites`, "success", 2000);
        return [...prev, bike];
      });
    },
    [addToast]
  );

  const removeFavorite = useCallback(
    (bikeId: string) => {
      const bikeToRemove = favorites.find((bike) => bike.id === bikeId);
      setFavorites((prev) => prev.filter((bike) => bike.id !== bikeId));
      if (bikeToRemove) {
        addToast(`${bikeToRemove.name} removed from favorites`, "info", 2000);
      }
    },
    [favorites, addToast]
  );

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
};
