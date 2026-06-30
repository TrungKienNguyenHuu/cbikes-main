import { useCallback, useState, useEffect } from "react";
import { Bike } from "../common/types";
import { useToast } from "../context/ToastContext";

const FAVORITES_STORAGE_KEY = "user_favorites_list";

export const useFavorites = () => {
  const { addToast } = useToast();

  // 1. Initialize state by checking localStorage first
  const [favorites, setFavorites] = useState<Bike[]>(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      return [];
    }
  });

  // 2. Automatically save to localStorage whenever the favorites array changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

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