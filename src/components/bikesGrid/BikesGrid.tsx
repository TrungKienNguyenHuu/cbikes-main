import { Bike } from "../../common/types";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageLoader";
import { getLowestPrice, getLowestPriceDiscount, getLowestPriceOriginal } from "../../utils/sellerPricing";
import { DiscountedPriceDisplay } from "../common/DiscountedPriceDisplay";
import { COLORS } from "../../common/constants";
import {
    StyledBottomOfBikeCard,
    StyledBikesGrid,
    StyledBikeImage,
    StyledBikeCardWithHover,
    StyledImageOverlay,
    StyledFavoriteButton,
    StyledSellerCountBadge,
    StyledDiscountBadge,
    StyledPriceContainer,
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

        const lowestPrice = getLowestPrice(bike.sellers, bike.price);
        const lowestPriceDiscount = getLowestPriceDiscount(bike.sellers);
        const lowestPriceOriginal = getLowestPriceOriginal(bike.sellers, bike.price);

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
                        {lowestPriceDiscount > 0 && (
                            <StyledDiscountBadge>
                                -{lowestPriceDiscount}%
                            </StyledDiscountBadge>
                        )}
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
                    <button onClick={() => addBikeToCart(bike)}>
                        Add to Compare
                    </button>

                    <StyledPriceContainer>
                        <DiscountedPriceDisplay
                            price={lowestPrice}
                            discountRate={lowestPriceDiscount}
                            originalPrice={lowestPriceOriginal ?? undefined}
                            size="lg"
                            color={COLORS.primary}
                            layout="vertical"
                            align="start"
                        />
                        {lowestPriceDiscount > 0 && (
                            <span style={{
                                backgroundColor: COLORS.error,
                                color: "white",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                fontWeight: "700",
                                whiteSpace: "nowrap"
                            }}>
                -{lowestPriceDiscount}%
              </span>
                        )}
                    </StyledPriceContainer>

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