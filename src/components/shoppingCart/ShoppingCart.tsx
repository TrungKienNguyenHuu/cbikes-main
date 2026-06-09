import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_PATH } from "../../common/constants";
import { Bike } from "../../common/types";
import { useToast } from "../../context/ToastContext";
import {
  StyledCartImg,
  StyledCartItem,
  StyledDeleteButton,
  StyledOrderButton,
  StyledScrollingList,
  StyledShoppingCart,
  StyledTitle,
} from "./ShoppingCart.style";

interface IProps {
  shoppingCart: Array<Bike>;
  removeBikeFromCart: (removeId: string) => void;
}

interface IShoppingItem {
  bike: Bike;
  removeBikeFromCart: (removeId: string) => void;
}

const ShoppingItem = memo(({ bike, removeBikeFromCart }: IShoppingItem) => {
  const [hasImageError, setHasImageError] = useState(false);
  const imageSource =
    bike.imgSrc.startsWith("http://") ||
    bike.imgSrc.startsWith("https://") ||
    bike.imgSrc.startsWith("data:") ||
    bike.imgSrc.startsWith("/")
      ? bike.imgSrc
      : `${IMG_PATH}${bike.imgSrc}`;

  return (
    <StyledCartItem>
      <StyledTitle>
        <h5>{bike.name}</h5>
        <span>{bike.price}$</span>
        <StyledDeleteButton onClick={() => removeBikeFromCart(bike.id)}>
          X
        </StyledDeleteButton>
      </StyledTitle>

      <StyledCartImg>
        {hasImageError ? (
          <span>Image unavailable</span>
        ) : (
          <img src={imageSource} alt={bike.name} onError={() => setHasImageError(true)} />
        )}
      </StyledCartImg>
    </StyledCartItem>
  );
});

export const ShoppingCart = memo(
  ({ shoppingCart, removeBikeFromCart }: IProps) => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    if (!shoppingCart.length) {
      return null;
    }

    const handleCompareClick = () => {
      if (shoppingCart.length < 2) {
        addToast("Add at least 2 products to compare", "warning", 2200);
        return;
      }
      navigate("/comparison");
    };

    return (
      // TODO: Divide code to components;
      <StyledShoppingCart>
        <StyledScrollingList>
          {shoppingCart.map((bike) => (
            <ShoppingItem
              key={bike.id}
              bike={bike}
              removeBikeFromCart={removeBikeFromCart}
            />
          ))}
        </StyledScrollingList>

        <StyledOrderButton onClick={handleCompareClick}>Compare</StyledOrderButton>
      </StyledShoppingCart>
    );
  }
);
