import { useCallback, useState } from "react";
import { Bike } from "../common/types";
import { useToast } from "../context/ToastContext";

const MAX_CART_ITEMS = 2;

export const useShoppingCart = () => {
  const [shoppingCart, setShoppingCart] = useState<Array<Bike>>([]);
  const { addToast } = useToast();

  const addBikeToCart = useCallback(
    (bike: Bike) => {
      if (shoppingCart.length >= MAX_CART_ITEMS) {
        addToast(`Maximum ${MAX_CART_ITEMS} products allowed for comparison`, "warning", 2000);
        return;
      }
      setShoppingCart((prevBikes) => [...prevBikes, bike]);
      addToast(`${bike.name} added to compare`, "success", 2000);
    },
    [shoppingCart, addToast]
  );

  const removeBikeFromCart = useCallback(
    (deleteId: string) => {
      const bikeToRemove = shoppingCart.find((bike) => bike.id === deleteId);
      setShoppingCart((prevBikes) =>
        prevBikes.filter((bike) => bike.id !== deleteId)
      );
      if (bikeToRemove) {
        addToast(`${bikeToRemove.name} removed from compare`, "info", 2000);
      }
    },
    [shoppingCart, addToast]
  );

  return { shoppingCart, addBikeToCart, removeBikeFromCart };
};
