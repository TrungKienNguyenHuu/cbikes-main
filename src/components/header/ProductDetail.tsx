import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Bike } from "../../common/types";
import { fetchBikeByIdFromAPI } from "../../services/bikeService";
import { useShoppingCart } from "../../hooks/shoppingCart.hook";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageLoader";
import { uuid } from "../../utils/uuid";

/**
 * Unescape unicode escape sequences in JSON strings
 * Converts \u003C to <, \u003E to >, etc.
 */
const unescapeUnicode = (text: string): string => {
  return text.replace(/\\u([\dA-F]{4})/gi, (match, grp) => {
    return String.fromCharCode(parseInt(grp, 16));
  });
};

/**
 * Check if text looks like HTML
 */
const isHtmlContent = (text: string): boolean => {
  const unescaped = unescapeUnicode(text);
  // Check if it contains HTML tags or encoded HTML patterns
  return /<[^>]+>/g.test(unescaped) || /\\u003C/.test(text);
};

/**
 * Extract clean HTML content from markdown wrapper
 * Removes the outer markdown-main-panel div and extracts inner HTML
 * Returns null if content is plain text
 */
const extractHtmlContent = (html: string): string | null => {
  // First unescape unicode sequences
  const unescaped = unescapeUnicode(html);
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(unescaped, "text/html");
  const markdownPanel = doc.querySelector(".markdown-main-panel");
  
  if (markdownPanel) {
    return markdownPanel.innerHTML;
  }
  
  // If no markdown panel, but it's HTML-like, return the unescaped HTML
  if (/<[^>]+>/g.test(unescaped)) {
    return unescaped;
  }
  
  // Otherwise return null to indicate it's plain text
  return null;
};

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
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
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

const StyledPriceRange = styled.div`
  font-size: 1.5rem;
  color: #666;
  
  strong {
    color: #e74c3c;
    font-size: 2rem;
  }
`;

// Updated: Removed the grid columns since the spec section was moved out
const StyledInfoTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledPricingCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
`;

// Updated: Added margin-top to separate from the top grid layout
const StyledSpecTableWrapper = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const StyledSpecTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 1.2rem 0;
  color: #333;
`;

// Updated: Changed from a table to a horizontal grid to better utilize full width
const StyledSpecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const StyledSpecItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-bottom: 1px solid #e7e7e7;
  padding-bottom: 0.5rem;
`;

const StyledSpecRowLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
`;

const StyledSpecRowValue = styled.span`
  font-size: 1.05rem;
  color: #222;
`;

const StyledDescriptionSection = styled.section`
  margin-top: 2rem;
  padding: 1.25rem;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  line-height: 1.8;
  color: #444;

  /* HTML content styles */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
    display: block;
  }

  p {
    margin: 1rem 0;
    line-height: 1.8;
  }

  ul, ol {
    margin: 1rem 0 1rem 2rem;
    line-height: 1.8;
  }

  li {
    margin: 0.5rem 0;
  }

  strong {
    font-weight: 700;
    color: #333;
  }

  br {
    line-height: 1.5;
  }
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

const StyledStoreCountBadge = styled.div`
  display: inline-block;
  background-color: #27ae60;
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 0.75rem;
`;

const StyledStoreCountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
`;

const StyledLastUpdatedText = styled.span`
  font-size: 0.75rem;
  color: #999;
  font-style: italic;
`;

const StyledActualSellersSection = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f0f8f4;
  border: 1px solid #d4edda;
  border-radius: 8px;
`;

const StyledActualSellersTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #27ae60;
  margin-bottom: 0.5rem;
`;

const StyledActualSellersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledActualSellerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #d4edda;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e8f5e9;
    border-color: #27ae60;
    box-shadow: 0 2px 4px rgba(39, 174, 96, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const StyledActualSellerName = styled.span`
  font-weight: 600;
  color: #333;
`;

const StyledActualSellerPrice = styled.span`
  color: #e74c3c;
  font-weight: 700;
`;

export const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addBikeToCart } = useShoppingCart();
  
  const [product, setProduct] = useState<Bike | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  

  useEffect(() => {
    if (!productId) return;
    
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setImageError(false);
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

  const handleImageError = () => {
    setImageError(true);
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

  const imageSrc = getImageUrl(product.imgSrc);
  
  return (
    <StyledDetailContainer>
      <StyledDetailHeader>
        <StyledBackButton onClick={() => navigate("/")}>
          ← Back to Products
        </StyledBackButton>
      </StyledDetailHeader>

      <StyledDetailGrid>
        <StyledImageSection>
          <StyledImage 
            src={imageError ? getPlaceholderImage() : imageSrc} 
            alt={product.name}
            onError={handleImageError}
          />
        </StyledImageSection>

        <StyledInfoSection>
          <StyledTitle>{product.name}</StyledTitle>
          <StyledInfoTop>
            <StyledPricingCard>
              <StyledPriceRange>
                Lowest Price: <strong>${lowestPrice}</strong>
              </StyledPriceRange>
              
              <StyledAddToCartButton onClick={handleAddToCart}>
                Add to Compare
              </StyledAddToCartButton>

              {product.sellers && product.sellers.length > 0 && (
                <>
                  <StyledStoreCountContainer>
                    <StyledStoreCountBadge>
                      {product.sellers.length} Store{product.sellers.length > 1 ? "s" : ""} Available
                    </StyledStoreCountBadge>
                    {product.lastUpdated && (
                      <StyledLastUpdatedText>
                        Last updated: {new Date(product.lastUpdated).toLocaleString()}
                      </StyledLastUpdatedText>
                    )}
                  </StyledStoreCountContainer>
                  
                  <StyledActualSellersSection>
                    <StyledActualSellersTitle>
                      Available at:
                    </StyledActualSellersTitle>
                    <StyledActualSellersList>
                      {product.sellers.map((seller, idx) => (
                        <StyledActualSellerItem 
                          key={idx}
                          onClick={() => {
                            console.log(`🔗 Clicked seller: ${seller.name} | URL: ${seller.url}`);
                            if (seller.url) {
                              window.open(seller.url, "_blank");
                            }
                          }}
                        >
                          <StyledActualSellerName>{seller.name}</StyledActualSellerName>
                          <StyledActualSellerPrice>${seller.price}</StyledActualSellerPrice>
                        </StyledActualSellerItem>
                      ))}
                    </StyledActualSellersList>
                  </StyledActualSellersSection>
                </>
              )}
            </StyledPricingCard>
          </StyledInfoTop>
        </StyledInfoSection>
      </StyledDetailGrid>

      {/* Moved Specifications section here to act as a horizontal bridge */}
      <StyledSpecTableWrapper>
        <StyledSpecTitle>Specifications</StyledSpecTitle>
        {product.specifications && Object.keys(product.specifications).length > 0 ? (
          <StyledSpecGrid>
            {Object.entries(product.specifications).map(([key, value], idx) => (
              <StyledSpecItem key={idx}>
                <StyledSpecRowLabel>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
                </StyledSpecRowLabel>
                <StyledSpecRowValue>
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </StyledSpecRowValue>
              </StyledSpecItem>
            ))}
          </StyledSpecGrid>
        ) : (
          <p>No specifications available for this product.</p>
        )}
      </StyledSpecTableWrapper>

      <StyledDescriptionSection>
        <StyledSpecTitle>Product Description</StyledSpecTitle>
        {product.description ? (
          (() => {
            const htmlContent = extractHtmlContent(product.description);
            if (htmlContent) {
              return (
                <div
                  dangerouslySetInnerHTML={{
                    __html: htmlContent,
                  }}
                />
              );
            } else {
              return <p>{product.description}</p>;
            }
          })()
        ) : (
          <p>No product description available for this listing.</p>
        )}
      </StyledDescriptionSection>
    </StyledDetailContainer>
  );
};