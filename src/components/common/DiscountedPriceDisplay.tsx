import styled from "styled-components";
import { PriceDisplay } from "./PriceDisplay";
import { getOriginalPrice } from "../../utils/sellerPricing";

type PriceSize = "sm" | "md" | "lg" | "xl";

interface DiscountedPriceDisplayProps {
    price: number;
    discountRate: number;
    originalPrice?: number;
    size?: PriceSize;
    color?: string;
    originalColor?: string;
    layout?: "horizontal" | "vertical";
    align?: "start" | "end";
    as?: "div" | "span";
    className?: string;
}

// Aggressively force horizontal layout and black color on the 2nd item
const HorizontalWrap = styled.span`
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem;

  /* Target the original price (second child) and force it black */
  & > :last-child,
  & > :last-child * {
    color: #000000 !important;
  }
`;

// Aggressively force vertical layout and black color on the 2nd item
const VerticalWrap = styled.span<{ $align: "start" | "end" }>`
  display: inline-flex !important;
  flex-direction: column !important;
  align-items: ${({ $align }) => ($align === "start" ? "flex-start" : "flex-end")} !important;
  gap: 0.15rem;

  /* Target the original price (second child) and force it black */
  & > :last-child,
  & > :last-child * {
    color: #000000 !important;
  }
`;

export const DiscountedPriceDisplay = ({
                                           price,
                                           discountRate,
                                           originalPrice: propOriginalPrice,
                                           size = "md",
                                           color,
                                           originalColor = "#000000",
                                           layout = "horizontal", // Defaults to side-by-side (Product Details Page)
                                           align = "start",
                                           as = "span",
                                           className,
                                       }: DiscountedPriceDisplayProps) => {
    // Use the passed-in originalPrice when available, otherwise calculate it.
    // Do not show an original price when it is not actually above the current price.
    const originalPrice =
        typeof propOriginalPrice === "number" && propOriginalPrice > 0
            ? propOriginalPrice
            : getOriginalPrice(price, discountRate);

    if (originalPrice === null || originalPrice <= price) {
        return (
            <PriceDisplay
                price={price}
                size={size}
                color={color}
                as={as}
                className={className}
            />
        );
    }

    const priceContent = (
        <>
            <PriceDisplay price={price} size={size} color={color} />
            <PriceDisplay
                price={originalPrice}
                size="sm"
                color={originalColor}
                strikethrough
            />
        </>
    );

    if (layout === "vertical") {
        return (
            <VerticalWrap as={as} className={className} $align={align}>
                {priceContent}
            </VerticalWrap>
        );
    }

    return (
        <HorizontalWrap as={as} className={className}>
            {priceContent}
        </HorizontalWrap>
    );
};
