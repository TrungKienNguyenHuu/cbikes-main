import { useParams, useNavigate } from "react-router-dom";
import { IMG_PATH } from "../../common/constants";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Bike } from "../../common/types";
import { fetchBikeByIdFromAPI } from "../../services/bikeService";
import { useShoppingCart } from "../../hooks/shoppingCart.hook";
import { uuid } from "../../utils/uuid";

const StyledDetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledDetailHeader = styled.div`
  margin-bottom: 2rem;
`;

const StyledBackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;

const StyledDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledImageSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
`;

const StyledInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StyledTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  color: #333;
`;

const StyledPriceRange = styled.div`
  font-size: 1.5rem;
  color: #666;
  
  strong {
    color: #e74c3c;
    font-size: 2rem;
  }
`;

const StyledSpecifications = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSpecItem = styled.div`
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  line-height: 1.6;
`;

const StyledSellersSection = styled.div`
  border-top: 2px solid #eee;
  padding-top: 2rem;
`;

const StyledSellerCard = styled.div`
  padding: 1.5rem;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StyledSellerHeader = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #333;
`;

const StyledSellerPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 0.5rem 0;
`;

const StyledSellerLink = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  margin-top: 0.5rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #229954;
  }
`;

const StyledSpecTitle = styled.h2`
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem 0;
  color: #333;
`;

const StyledSellersGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledAddToCartButton = styled.button`
  padding: 1rem 2rem;
  background-color: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;

  &:hover {
    background-color: #ff5a1a;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addBikeToCart } = useShoppingCart();
  
  const [product, setProduct] = useState<Bike | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bike = await fetchBikeByIdFromAPI(productId);
        setProduct(bike);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load product";
        setError(errorMessage);
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addBikeToCart({ ...product, id: uuid() });
    }
  };

  if (isLoading) {
    return (
      <StyledDetailContainer>
        <StyledDetailHeader>
          <StyledBackButton onClick={() => navigate("/")}>
            ← Back to Products
          </StyledBackButton>
        </StyledDetailHeader>
        <div>Loading product...</div>
      </StyledDetailContainer>
    );
  }

  if (!product) {
    return (
      <StyledDetailContainer>
        <StyledDetailHeader>
          <StyledBackButton onClick={() => navigate("/")}>
            ← Back to Products
          </StyledBackButton>
        </StyledDetailHeader>
        <div>Product not found: {error}</div>
      </StyledDetailContainer>
    );
  }

  const lowestPrice =
    product.sellers && product.sellers.length > 0
      ? Math.min(...product.sellers.map((s) => s.price))
      : product.price;

  return (
    <StyledDetailContainer>
      <StyledDetailHeader>
        <StyledBackButton onClick={() => navigate("/")}>
          ← Back to Products
        </StyledBackButton>
      </StyledDetailHeader>

      <StyledDetailGrid>
        <StyledImageSection>
          <StyledImage src={`${product.imgSrc}`} alt={product.name} />
        </StyledImageSection>

        <StyledInfoSection>
          <StyledTitle>{product.name}</StyledTitle>
          <StyledPriceRange>
            Lowest Price: <strong>${lowestPrice}</strong>
          </StyledPriceRange>

          <StyledAddToCartButton onClick={handleAddToCart}>
            + Add to Cart
          </StyledAddToCartButton>

          {product.specifications && (
            <div>
              <StyledSpecTitle>Specifications</StyledSpecTitle>
              <StyledSpecifications>
                <StyledSpecItem>
                  <strong>Battery Capacity:</strong> {product.specifications.batteryCapacity}
                </StyledSpecItem>
                <StyledSpecItem>
                  <strong>Motor Power:</strong> {product.specifications.motorPower}
                </StyledSpecItem>
                <StyledSpecItem>
                  <strong>Max Speed:</strong> {product.specifications.maxSpeed}
                </StyledSpecItem>
                <StyledSpecItem>
                  <strong>Range:</strong> {product.specifications.range}
                </StyledSpecItem>
                <StyledSpecItem>
                  <strong>Weight:</strong> {product.specifications.weight}
                </StyledSpecItem>
                <StyledSpecItem>
                  <strong>Charging Time:</strong> {product.specifications.chargingTime}
                </StyledSpecItem>
              </StyledSpecifications>
            </div>
          )}

          {product.sellers && product.sellers.length > 0 && (
            <StyledSellersSection>
              <StyledSpecTitle>Available at Sellers</StyledSpecTitle>
              <StyledSellersGrid>
                {product.sellers.map((seller, idx) => (
                  <StyledSellerCard key={idx}>
                    <StyledSellerHeader>{seller.name}</StyledSellerHeader>
                    <StyledSellerPrice>${seller.price}</StyledSellerPrice>
                    <StyledSellerLink
                      href={seller.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on {seller.name} →
                    </StyledSellerLink>
                  </StyledSellerCard>
                ))}
              </StyledSellersGrid>
            </StyledSellersSection>
          )}
        </StyledInfoSection>
      </StyledDetailGrid>
    </StyledDetailContainer>
  );
};
