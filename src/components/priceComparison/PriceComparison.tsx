import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Bike } from "../../common/types";
import { memo } from "react";

const ComparisonContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const ComparisonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

const BackButton = styled.button`
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

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 2rem;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #ff6b35;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 1.5rem;
  border-radius: 8px;
`;

const ProductName = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 1rem 0;
`;

const PriceSection = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ff6b35;
`;

const PriceLabel = styled.span`
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #e74c3c;
`;

const SpecificationsSection = styled.div`
  margin-top: 1.5rem;
`;

const SpecTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const SpecLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const SpecValue = styled.span`
  color: #333;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 2px dashed #ddd;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

interface IPriceComparisonProps {
  shoppingCart: Array<Bike>;
  onBack: () => void;
}

const ProductComparisonItem = memo(({ bike }: { bike: Bike }) => {
  const lowestPrice =
    bike.sellers && bike.sellers.length > 0
      ? Math.min(...bike.sellers.map((s) => s.price))
      : bike.price;

  return (
    <ProductCard>
      <ProductImage src={bike.imgSrc} alt={bike.name} />
      <ProductName>{bike.name}</ProductName>

      <PriceSection>
        <PriceLabel>Lowest Price Available:</PriceLabel>
        <Price>${lowestPrice}</Price>
      </PriceSection>

      {bike.specifications && (
        <SpecificationsSection>
          <SpecTitle>Specifications</SpecTitle>
          <SpecItem>
            <SpecLabel>Battery Capacity:</SpecLabel>
            <SpecValue>{bike.specifications.batteryCapacity}</SpecValue>
          </SpecItem>
          <SpecItem>
            <SpecLabel>Motor Power:</SpecLabel>
            <SpecValue>{bike.specifications.motorPower}</SpecValue>
          </SpecItem>
          <SpecItem>
            <SpecLabel>Max Speed:</SpecLabel>
            <SpecValue>{bike.specifications.maxSpeed}</SpecValue>
          </SpecItem>
          <SpecItem>
            <SpecLabel>Range:</SpecLabel>
            <SpecValue>{bike.specifications.range}</SpecValue>
          </SpecItem>
          <SpecItem>
            <SpecLabel>Weight:</SpecLabel>
            <SpecValue>{bike.specifications.weight}</SpecValue>
          </SpecItem>
          <SpecItem>
            <SpecLabel>Charging Time:</SpecLabel>
            <SpecValue>{bike.specifications.chargingTime}</SpecValue>
          </SpecItem>
        </SpecificationsSection>
      )}
    </ProductCard>
  );
});

export const PriceComparison = memo(
  ({ shoppingCart, onBack }: IPriceComparisonProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
      navigate("/");
    };

    if (shoppingCart.length === 0) {
      return (
        <ComparisonContainer>
          <ComparisonHeader>
            <Title>Price Comparison</Title>
            <BackButton onClick={handleBack}>← Back to Shopping</BackButton>
          </ComparisonHeader>
          <EmptyState>
            <EmptyStateIcon>🛒</EmptyStateIcon>
            <EmptyStateText>No products added to cart for comparison</EmptyStateText>
            <BackButton onClick={handleBack}>Go Back to Shopping</BackButton>
          </EmptyState>
        </ComparisonContainer>
      );
    }

    return (
      <ComparisonContainer>
        <ComparisonHeader>
          <Title>
            Price Comparison ({shoppingCart.length}/2 Products)
          </Title>
          <BackButton onClick={handleBack}>← Back to Shopping</BackButton>
        </ComparisonHeader>

        <ComparisonGrid>
          {shoppingCart.map((bike) => (
            <ProductComparisonItem key={bike.id} bike={bike} />
          ))}
        </ComparisonGrid>
      </ComparisonContainer>
    );
  }
);
