import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_PATH } from "../../common/constants";
import { Bike } from "../../common/types";
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
        <img src={`${IMG_PATH}${bike.imgSrc}`} alt="" />
      </StyledCartImg>
    </StyledCartItem>
  );
});

const getOrderSum = (cart: Array<Bike>) =>
  cart.reduce((acc, el) => acc + el.price, 0);

export const ShoppingCart = memo(
  ({ shoppingCart, removeBikeFromCart }: IProps) => {
    const navigate = useNavigate();

    if (!shoppingCart.length) {
      return null;
    }

    const handleOrderClick = () => {
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

        <StyledOrderButton onClick={handleOrderClick}>
          ORDER {getOrderSum(shoppingCart)}$
        </StyledOrderButton>
      </StyledShoppingCart>
    );
  }
);
