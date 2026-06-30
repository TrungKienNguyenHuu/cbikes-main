import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Bike } from "../../common/types";
import { fetchHotProducts, recordProductClick } from "../../services/hotProductsService";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageLoader";
import { getLowestPrice, getLowestPriceDiscount, getLowestPriceOriginal } from "../../utils/sellerPricing";
import { DiscountedPriceDisplay } from "../common/DiscountedPriceDisplay";
import { COLORS, SPACING } from "../../common/constants";

const StyledHotProductsSection = styled.section`
  margin: 3rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #fff5f5 0%, #fff9f0 100%);
  border-radius: 12px;
  border-left: 4px solid ${COLORS.error};
`;

const StyledTitle = styled.h2`
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 1.5rem;
  }
`;

const StyledSubtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1.5rem 0;
`;

const StyledLoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 1rem;
`;

const StyledErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${COLORS.error};
  font-size: 1rem;
`;

const StyledBikesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${SPACING.md};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StyledEmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #999;

  p {
    font-size: 1rem;
    margin: 0;
  }
`;

const StyledHotBikeCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const StyledBikeImage = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background: #f5f5f5;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8px;
  }
`;

const StyledHotBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${COLORS.error};
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 2;
`;

const StyledCardContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 120px;

  h3 {
    font-size: 0.95rem;
    margin: 0;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.4;
  }

  p {
    font-size: 0.8rem;
    color: #999;
    margin: 0;
  }
`;

const StyledPriceSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
  min-height: 46px;
  width: 100%;
`;

const StyledDiscountPill = styled.span`
  background-color: ${COLORS.error};
  color: white;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
`;

interface HotProductsProps {
    days?: number;
    limit?: number;
}

/**
 * HotProducts Component
 * Displays trending/hot products based on click count
 * Refreshes every 5 minutes
 */
export const HotProducts: React.FC<HotProductsProps> = ({
                                                            days = 7,
                                                            limit = 12,
                                                        }) => {
    const [hotProducts, setHotProducts] = useState<Bike[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const loadHotProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const products = await fetchHotProducts(days, limit);
                setHotProducts(products);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load hot products";
                setError(errorMessage);
                console.error("Error loading hot products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadHotProducts();

        // Refresh every 5 minutes
        const interval = setInterval(loadHotProducts, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [days, limit]);

    const handleProductClick = (bike: Bike) => {
        recordProductClick(bike.id);
        navigate(`/product/${bike.id}`);
    };

    const handleImageError = (bikeId: string) => {
        setImageErrors((prev) => {
            const nextErrors = new Set<string>();
            prev.forEach((id) => nextErrors.add(id));
            nextErrors.add(bikeId);
            return nextErrors;
        });
    };

    if (error) {
        return (
            <StyledHotProductsSection>
                <StyledTitle>
                    <span>🔥</span> Hot Products
                </StyledTitle>
                <StyledErrorMessage>Failed to load hot products</StyledErrorMessage>
            </StyledHotProductsSection>
        );
    }

    if (isLoading) {
        return (
            <StyledHotProductsSection>
                <StyledTitle>
                    <span>🔥</span> Hot Products
                </StyledTitle>
                <StyledLoadingMessage>Loading hot products...</StyledLoadingMessage>
            </StyledHotProductsSection>
        );
    }

    if (hotProducts.length === 0) {
        return (
            <StyledHotProductsSection>
                <StyledTitle>
                    <span>🔥</span> Hot Products
                </StyledTitle>
                <StyledEmptyState>
                    <p>No trending products yet. Check back soon!</p>
                </StyledEmptyState>
            </StyledHotProductsSection>
        );
    }

    return (
        <StyledHotProductsSection>
            <StyledTitle>
                <span>🔥</span> Hot Products
            </StyledTitle>
            <StyledSubtitle>
                Most viewed products in the last {days} days
            </StyledSubtitle>

            <StyledBikesGrid>
                {hotProducts.map((bike) => {
                    const imageSrc = getImageUrl(bike.imgSrc);
                    const lowestPrice = getLowestPrice(bike.sellers, bike.price);
                    const lowestPriceDiscount = getLowestPriceDiscount(bike.sellers);
                    const lowestPriceOriginal = getLowestPriceOriginal(bike.sellers, bike.price);
                    const hasImageError = imageErrors.has(bike.id);

                    return (
                        <StyledHotBikeCard key={bike.id} onClick={() => handleProductClick(bike)}>
                            <StyledBikeImage>
                                <StyledHotBadge>🔥 HOT</StyledHotBadge>
                                <img
                                    src={hasImageError ? getPlaceholderImage() : imageSrc}
                                    alt={bike.name}
                                    onError={() => handleImageError(bike.id)}
                                />
                            </StyledBikeImage>

                            <StyledCardContent>
                                <h3>{bike.name}</h3>
                                <p>{bike.reviewText}</p>

                                <StyledPriceSection>
                                    <DiscountedPriceDisplay
                                        price={lowestPrice}
                                        discountRate={lowestPriceDiscount}
                                        originalPrice={lowestPriceOriginal ?? undefined}
                                        size="md"
                                        originalSize="md"
                                        color={COLORS.primary}
                                        layout="vertical"
                                        align="start"
                                    />

                                    {lowestPriceDiscount > 0 && (
                                        <StyledDiscountPill>
                                            -{lowestPriceDiscount}%
                                        </StyledDiscountPill>
                                    )}
                                </StyledPriceSection>
                            </StyledCardContent>
                        </StyledHotBikeCard>
                    );
                })}
            </StyledBikesGrid>
        </StyledHotProductsSection>
    );
};

export default HotProducts;
