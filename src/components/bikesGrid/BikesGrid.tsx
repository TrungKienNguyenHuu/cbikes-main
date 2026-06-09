import { Bike } from "../../common/types";
import { uuid } from "../../utils/uuid";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageLoader";
import {
  StyledBottomOfBikeCard,
  StyledBikesGrid,
  StyledBikeImage,
  StyledBikeCardWithHover,
  StyledImageOverlay,
  StyledFavoriteButton,
  StyledSellerCountBadge,
} from "./BikesGrid.style";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  filteredBikesList: Array<Bike>;
  addBikeToCart: (bike: Bike) => void;
  isFavorite: (bikeId: string) => boolean;
  onToggleFavorite: (bike: Bike) => void;
}

interface IGridItemProps {
  bike: Bike;
  addBikeToCart: (bike: Bike) => void;
  isFavorite: (bikeId: string) => boolean;
  onToggleFavorite: (bike: Bike) => void;
}

const GridItem = memo(
  ({ bike, addBikeToCart, isFavorite, onToggleFavorite }: IGridItemProps) => {
    const navigate = useNavigate();
    const favorite = isFavorite(bike.id);
    const [imageError, setImageError] = useState(false);

    const handleImageClick = () => {
      navigate(`/product/${bike.id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(bike);
    };

    const handleImageError = () => {
      setImageError(true);
    };

    const imageSrc = getImageUrl(bike.imgSrc);

    return (
      <StyledBikeCardWithHover>
        <StyledBikeImage onClick={handleImageClick}>
          <img 
            src={imageError ? getPlaceholderImage() : imageSrc} 
            alt={bike.name}
            onError={handleImageError}
          />
          <StyledImageOverlay>
            <StyledFavoriteButton
              type="button"
              isFavorite={favorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              onClick={handleFavoriteClick}
            >
              {favorite ? "♥" : "♡"}
            </StyledFavoriteButton>
          </StyledImageOverlay>
        </StyledBikeImage>

        <StyledBottomOfBikeCard>
          <h3 onClick={handleImageClick} style={{ cursor: "pointer" }}>
            {bike.name}
          </h3>
          {bike.sellers && bike.sellers.length > 0 && (
            <StyledSellerCountBadge>
              💰 {bike.sellers.length} seller{bike.sellers.length > 1 ? "s" : ""}
            </StyledSellerCountBadge>
          )}
          <button onClick={() => addBikeToCart({ ...bike, id: uuid() })}>
            Add to Compare
          </button>
          <span>{bike.price}$</span>
        </StyledBottomOfBikeCard>
      </StyledBikeCardWithHover>
    );
  }
);

export const BikesGrid = memo(
  ({ filteredBikesList, addBikeToCart, isFavorite, onToggleFavorite }: IProps) => (
    <StyledBikesGrid>
      {filteredBikesList.map((bike) => (
        <GridItem
          key={bike.id}
          bike={bike}
          addBikeToCart={addBikeToCart}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </StyledBikesGrid>
  )
);
