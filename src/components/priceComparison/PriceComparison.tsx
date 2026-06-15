import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Bike } from "../../common/types";
import { memo } from "react";
import { PriceHistoryChart } from "../priceHistory/PriceHistoryChart";

const ComparisonContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const ComparisonHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
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
  margin-bottom: 1rem;
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

const SellersSection = styled.div`
  margin-top: 0.5rem;
`;

const SellersTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.75rem 0;
`;

const SellersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;
`;

const SellerLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  text-decoration: none;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #bfbfbf;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const SellerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const SellerLogo = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
`;

const SellerName = styled.span`
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
`;

const SellerPrice = styled.span`
  color: #e74c3c;
  font-size: 0.95rem;
  font-weight: 700;
`;

const SpecsComparisonSection = styled.section`
  margin-top: 2.5rem;
  padding: 1.5rem;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
`;

const SpecsTitle = styled.h2`
  font-size: 1.4rem;
  color: #333;
  margin: 0 0 1.25rem 0;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
`;

const PriceHistoryComparisonSection = styled.section`
  margin-top: 2.5rem;
  padding: 1.5rem;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
`;

const PriceHistoryTitle = styled.h2`
  font-size: 1.4rem;
  color: #333;
  margin: 0 0 1.25rem 0;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
`;

const PriceHistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PriceHistoryChartContainer = styled.div`
  padding: 1rem;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fafafa;
`;

const BikeChartTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 600;
`;

const SpecsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const SpecsTableHeadCell = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  color: #333;
  border-bottom: 2px solid #e7e7e7;
  font-weight: 700;
`;

const SpecsTableLabelCell = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  color: #444;
  border-bottom: 1px solid #e7e7e7;
  width: 28%;
  font-weight: 600;
`;

const SpecsTableValueCell = styled.td`
  text-align: left;
  padding: 0.75rem 0.5rem;
  color: #222;
  border-bottom: 1px solid #e7e7e7;
`;

const SpecsTableWrapper = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SpecsTableTitle = styled.h3`
  font-size: 1.1rem;
  color: #555;
  margin: 1.5rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;

  &:first-child {
    margin-top: 0;
  }
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

/**
 * Extract specifications from bike data
 * Converts flat object to array of {label, value} pairs
 */
const extractSpecsFromBike = (bike: Bike): Array<{ label: string; value: string }> => {
    if (!bike.specifications || typeof bike.specifications !== "object") {
        return [];
    }

    return Object.entries(bike.specifications).map(([key, value]) => ({
        label: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim(),
        value: String(value),
    }));
};

/**
 * Group specifications into categories (e.g., "Battery", "Motor", "Performance")
 * Returns array of category objects with their specs
 */
const groupSpecsByCategory = (
    specs: Array<{ label: string; value: string }>
): Array<{ category: string; specs: Array<{ label: string; value: string }> }> => {
    const categoryKeywords: Record<string, string> = {
        Battery: ["battery", "capacity", "ah", "voltage", "v"],
        Motor: ["motor", "power", "watt", "w", "hub"],
        Performance: ["speed", "max", "range", "km", "h"],
        Build: ["frame", "weight", "brakes", "tires", "size"],
        Other: [],
    };

    const grouped: Record<string, Array<{ label: string; value: string }>> = {
        Battery: [],
        Motor: [],
        Performance: [],
        Build: [],
        Other: [],
    };

    specs.forEach((spec) => {
        const lowerLabel = spec.label.toLowerCase();
        let categorized = false;

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.length === 0) continue;
            if (keywords.some((keyword) => lowerLabel.includes(keyword))) {
                grouped[category].push(spec);
                categorized = true;
                break;
            }
        }

        if (!categorized) {
            grouped.Other.push(spec);
        }
    });

    return Object.entries(grouped)
        .filter(([, specs]) => specs.length > 0)
        .map(([category, specs]) => ({ category, specs }));
};

/**
 * Get seller details from bike sellers, generate logo from name
 */
const getSellerDetailsFromBike = (bike: Bike) => {
    if (!bike.sellers || bike.sellers.length === 0) {
        return [];
    }

    return bike.sellers.map((seller) => ({
        name: seller.name,
        logo: seller.name.substring(0, 2).toUpperCase(),
        price: seller.price,
        url: seller.url,
    }));
};

interface IPriceComparisonProps {
    shoppingCart: Array<Bike>;
    onBack?: () => void;
}

const ProductComparisonItem = memo(({ bike }: { bike: Bike }) => {
    const sellers = getSellerDetailsFromBike(bike);
    const lowestPrice =
        sellers && sellers.length > 0 ? Math.min(...sellers.map((s) => s.price)) : bike.price;

    return (
        <ProductCard>
            <ProductImage src={bike.imgSrc} alt={bike.name} />
            <ProductName>{bike.name}</ProductName>

            <PriceSection>
                <PriceLabel>Lowest Price Available:</PriceLabel>
                <Price>${lowestPrice}</Price>
            </PriceSection>

            <SellersSection>
                <SellersTitle>Available at {sellers.length} Seller{sellers.length !== 1 ? "s" : ""}</SellersTitle>
                <SellersGrid>
                    {sellers.map((seller) => (
                        <SellerLink
                            key={seller.name}
                            href={seller.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <SellerLeft>
                                <SellerLogo>{seller.logo}</SellerLogo>
                                <SellerName>{seller.name}</SellerName>
                            </SellerLeft>
                            <SellerPrice>${seller.price}</SellerPrice>
                        </SellerLink>
                    ))}
                </SellersGrid>
            </SellersSection>
        </ProductCard>
    );
});

/**
 * Component to render a single specifications table
 */
const SpecificationTable = memo(
    ({
         bikes,
         specs,
         title,
     }: {
        bikes: Bike[];
        specs: Array<{ label: string; value: string }>;
        title?: string;
    }) => (
        <SpecsTableWrapper>
            {title && <SpecsTableTitle>{title}</SpecsTableTitle>}
            <SpecsTable>
                <thead>
                <tr>
                    <SpecsTableHeadCell>Specification</SpecsTableHeadCell>
                    {bikes.map((bike) => (
                        <SpecsTableHeadCell key={bike.id}>{bike.name}</SpecsTableHeadCell>
                    ))}
                </tr>
                </thead>
                <tbody>
                {specs.map((spec) => (
                    <tr key={spec.label}>
                        <SpecsTableLabelCell>{spec.label}</SpecsTableLabelCell>
                        {bikes.map((bike) => {
                            const bikeSpecs = extractSpecsFromBike(bike);
                            const bikeSpecValue = bikeSpecs.find(
                                (s) => s.label.toLowerCase() === spec.label.toLowerCase()
                            );
                            return (
                                <SpecsTableValueCell key={`${bike.id}-${spec.label}`}>
                                    {bikeSpecValue?.value || "N/A"}
                                </SpecsTableValueCell>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </SpecsTable>
        </SpecsTableWrapper>
    )
);

/**
 * Component to render specifications comparison
 * Splits specs into multiple tables by category
 */
const SpecificationsComparison = memo(({ bikes }: { bikes: Bike[] }) => {
    // Collect all unique specifications across all bikes
    const allSpecs = new Map<string, { label: string; value: string }>();

    bikes.forEach((bike) => {
        const specs = extractSpecsFromBike(bike);
        specs.forEach((spec) => {
            const key = spec.label.toLowerCase();
            if (!allSpecs.has(key)) {
                allSpecs.set(key, spec);
            }
        });
    });

    const uniqueSpecs = Array.from(allSpecs.values());

    // If no specifications available, show empty state
    if (uniqueSpecs.length === 0) {
        return (
            <SpecsComparisonSection>
                <SpecsTitle>Specifications</SpecsTitle>
                <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>
                    No specifications available for comparison
                </p>
            </SpecsComparisonSection>
        );
    }

    // Group specs by category
    const groupedSpecs = groupSpecsByCategory(uniqueSpecs);

    return (
        <SpecsComparisonSection>
            <SpecsTitle>Specifications Comparison</SpecsTitle>
            {groupedSpecs.map((group, index) => (
                <SpecificationTable
                    key={group.category}
                    bikes={bikes}
                    specs={group.specs}
                    title={groupedSpecs.length > 1 ? group.category : undefined}
                />
            ))}
        </SpecsComparisonSection>
    );
});

/**
 * Component to render price history comparison
 * Shows side-by-side price trend charts for all bikes
 */
const PriceHistoryComparison = memo(({ bikes }: { bikes: Bike[] }) => {
    // Filter bikes that have price history
    const bikesWithHistory = bikes.filter((bike) => bike.priceHistory && bike.priceHistory.length > 0);

    // If no bikes have price history, show empty state
    if (bikesWithHistory.length === 0) {
        return (
            <PriceHistoryComparisonSection>
                <PriceHistoryTitle>Price History Comparison</PriceHistoryTitle>
                <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>
                    No price history available for comparison
                </p>
            </PriceHistoryComparisonSection>
        );
    }

    return (
        <PriceHistoryComparisonSection>
            <PriceHistoryTitle>Price History Comparison</PriceHistoryTitle>
            <PriceHistoryGrid>
                {bikesWithHistory.map((bike) => (
                    <PriceHistoryChartContainer key={bike.id}>
                        <BikeChartTitle>{bike.name}</BikeChartTitle>
                        <PriceHistoryChart
                            priceHistory={bike.priceHistory!}
                            currentPrice={bike.price}
                        />
                    </PriceHistoryChartContainer>
                ))}
            </PriceHistoryGrid>
        </PriceHistoryComparisonSection>
    );
});

export const PriceComparison = memo(
    ({ shoppingCart }: IPriceComparisonProps) => {
        const navigate = useNavigate();

        const handleBack = () => {
            navigate("/");
        };

        if (shoppingCart.length === 0) {
            return (
                <ComparisonContainer>
                    <ComparisonHeader>
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
                    <BackButton onClick={handleBack}>← Back to Shopping</BackButton>
                </ComparisonHeader>

                <ComparisonGrid>
                    {shoppingCart.map((bike) => (
                        <ProductComparisonItem key={bike.id} bike={bike} />
                    ))}
                </ComparisonGrid>

                <PriceHistoryComparison bikes={shoppingCart} />
                <SpecificationsComparison bikes={shoppingCart} />
            </ComparisonContainer>
        );
    }
);