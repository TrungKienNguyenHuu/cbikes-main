import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
/*import { fetchProductByIdFromTestBackend, formatVNDPrice, ProductFromTestAPI } from "../../services/productService";*/

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
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledImageSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 2rem;
  min-height: 400px;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
`;

const StyledPlaceholderImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  background-color: #e0e0e0;
  border-radius: 8px;
  color: #999;
  font-size: 1rem;
`;

const StyledInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 7rem;

  @media (max-width: 768px) {
    position: static;
    top: auto;
  }
`;

const StyledTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  color: #333;
`;

const StyledBrand = styled.p`
  font-size: 1rem;
  color: #888;
  margin: 0.5rem 0 0 0;
`;

const StyledPriceRange = styled.div`
  font-size: 1.5rem;
  color: #666;
  
  strong {
    color: #e74c3c;
    font-size: 2rem;
  }
`;

const StyledInfoTop = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 280px) 1fr;
  gap: 1rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StyledPricingCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
`;

const StyledListingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;
  margin: 1rem 0;
`;

const StyledListingLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
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

const StyledListingLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const StyledListingSource = styled.span`
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
`;

const StyledListingTitle = styled.span`
  color: #666;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledListingPrice = styled.span`
  color: #e74c3c;
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
`;

const StyledSpecTableWrapper = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
`;

const StyledSpecTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const StyledSpecRowLabel = styled.th`
  text-align: left;
  padding: 0.6rem 0.5rem;
  color: #444;
  border-bottom: 1px solid #e7e7e7;
  width: 45%;
`;

const StyledSpecRowValue = styled.td`
  text-align: left;
  padding: 0.6rem 0.5rem;
  color: #222;
  border-bottom: 1px solid #e7e7e7;
`;

const StyledDescriptionSection = styled.section`
  margin-top: 2rem;
  padding: 1.25rem;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  line-height: 1.8;
  color: #444;
`;

const StyledListingsSection = styled.div`
  border-top: 2px solid #eee;
  padding-top: 2rem;
`;

const StyledListingCard = styled.div`
  padding: 1.5rem;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StyledListingCardHeader = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #333;
`;

const StyledListingCardPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 0.5rem 0;
`;

const StyledListingCardTitle = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin: 0.5rem 0;
`;

const StyledListingCardLink = styled.a`
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
  font-size: 1.3rem;
  margin: 0 0 0.8rem 0;
  color: #333;
`;

const StyledListingsGrid2 = styled.div`
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



export const ProductDetailCopy = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ProductFromTestAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProductByIdFromTestBackend(productId);
        setProduct(data);
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
    product.listings && product.listings.length > 0
      ? Math.min(...product.listings.map((l) => l.price))
      : null;

  const topListings = product.listings?.slice(0, 3) || [];

  return (
    <StyledDetailContainer>
      <StyledDetailHeader>
        <StyledBackButton onClick={() => navigate("/")}>
          ← Back to Products
        </StyledBackButton>
      </StyledDetailHeader>

      <StyledDetailGrid>
        <StyledImageSection>
          <StyledPlaceholderImage>Product Image</StyledPlaceholderImage>
        </StyledImageSection>

        <StyledInfoSection>
          <div>
            <StyledTitle>{product.name}</StyledTitle>
            <StyledBrand>Brand: {product.brand || "Unknown"}</StyledBrand>
          </div>

          <StyledInfoTop>
            <StyledPricingCard>
              {lowestPrice !== null && (
                <>
                  <StyledPriceRange>
                    Lowest Price: <strong>{formatVNDPrice(lowestPrice)}</strong>
                  </StyledPriceRange>
                  <StyledListingsGrid>
                    {topListings.map((listing) => (
                      <StyledListingLink
                        key={listing.listing_id}
                        href={`#`}
                        title={listing.listing_title}
                      >
                        <StyledListingLeft>
                          <StyledListingSource>{listing.source_name}</StyledListingSource>
                          <StyledListingTitle>{listing.listing_title}</StyledListingTitle>
                        </StyledListingLeft>
                        <StyledListingPrice>{formatVNDPrice(listing.price)}</StyledListingPrice>
                      </StyledListingLink>
                    ))}
                  </StyledListingsGrid>
                </>
              )}
              <StyledAddToCartButton onClick={() => alert("Add to cart functionality")}>
                Add to Compare
              </StyledAddToCartButton>
            </StyledPricingCard>

            <StyledSpecTableWrapper>
              <StyledSpecTitle>Product Information</StyledSpecTitle>
              <StyledSpecTable>
                <tbody>
                  <tr>
                    <StyledSpecRowLabel>Product ID</StyledSpecRowLabel>
                    <StyledSpecRowValue>{product.product_id}</StyledSpecRowValue>
                  </tr>
                  <tr>
                    <StyledSpecRowLabel>Brand</StyledSpecRowLabel>
                    <StyledSpecRowValue>{product.brand || "N/A"}</StyledSpecRowValue>
                  </tr>
                  <tr>
                    <StyledSpecRowLabel>Listed Prices</StyledSpecRowLabel>
                    <StyledSpecRowValue>{product.listings?.length || 0} listings</StyledSpecRowValue>
                  </tr>
                  <tr>
                    <StyledSpecRowLabel>Created</StyledSpecRowLabel>
                    <StyledSpecRowValue>
                      {new Date(product.created_at).toLocaleDateString()}
                    </StyledSpecRowValue>
                  </tr>
                </tbody>
              </StyledSpecTable>
            </StyledSpecTableWrapper>
          </StyledInfoTop>

          {product.listings && product.listings.length > 0 && (
            <StyledListingsSection>
              <StyledSpecTitle>All Available Listings ({product.listings.length})</StyledSpecTitle>
              <StyledListingsGrid2>
                {product.listings.map((listing) => (
                  <StyledListingCard key={listing.listing_id}>
                    <StyledListingCardHeader>{listing.source_name}</StyledListingCardHeader>
                    <StyledListingCardPrice>{formatVNDPrice(listing.price)}</StyledListingCardPrice>
                    <StyledListingCardTitle>{listing.listing_title}</StyledListingCardTitle>
                    <StyledListingCardLink href="#" target="_blank" rel="noopener noreferrer">
                      View on {listing.source_name} →
                    </StyledListingCardLink>
                  </StyledListingCard>
                ))}
              </StyledListingsGrid2>
            </StyledListingsSection>
          )}
        </StyledInfoSection>
      </StyledDetailGrid>

      <StyledDescriptionSection>
        <StyledSpecTitle>About This Product</StyledSpecTitle>
        <p>
          This product is from the {product.brand} brand and has {product.listings?.length || 0} 
          active listings from various sellers. The price ranges from{" "}
          {lowestPrice !== null ? formatVNDPrice(lowestPrice) : "N/A"} to{" "}
          {product.listings && product.listings.length > 0
            ? formatVNDPrice(Math.max(...product.listings.map((l) => l.price)))
            : "N/A"}
          .
        </p>
      </StyledDescriptionSection>
    </StyledDetailContainer>
  );
};
