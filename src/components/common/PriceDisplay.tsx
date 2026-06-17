import styled, { css } from "styled-components";
import { COLORS } from "../../common/constants";
import { formatVNDNumber } from "../../utils/formatPrice";

type PriceSize = "sm" | "md" | "lg" | "xl";

interface PriceDisplayProps {
  price: number;
  className?: string;
  size?: PriceSize;
  color?: string;
  strikethrough?: boolean;
  as?: "div" | "span";
}

const sizeStyles: Record<PriceSize, ReturnType<typeof css>> = {
  sm: css`
    font-size: 0.85rem;

    sup {
      font-size: 0.55rem;
    }
  `,
  md: css`
    font-size: 1.1rem;

    sup {
      font-size: 0.65rem;
    }
  `,
  lg: css`
    font-size: 1.5rem;

    sup {
      font-size: 0.75rem;
    }
  `,
  xl: css`
    font-size: 2rem;

    sup {
      font-size: 0.85rem;
    }
  `,
};

const StyledPrice = styled.span<{
  $size: PriceSize;
  $color?: string;
  $strikethrough?: boolean;
}>`
  display: inline-block;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ $color }) => $color ?? "rgb(39, 39, 42)"};
  text-decoration: ${({ $strikethrough }) =>
    $strikethrough ? "line-through" : "none"};

  sup {
    font-weight: 600;
    margin-left: 1px;
    vertical-align: super;
    color: ${({ $color }) => $color ?? COLORS.textLight};
  }

  ${({ $size }) => sizeStyles[$size]}
`;

export const PriceDisplay = ({
  price,
  className = "price-discount__price",
  size = "md",
  color,
  strikethrough = false,
  as: Component = "span",
}: PriceDisplayProps) => (
  <StyledPrice
    as={Component}
    className={className}
    $size={size}
    $color={color}
    $strikethrough={strikethrough}
  >
    {formatVNDNumber(price)}
    <sup>₫</sup>
  </StyledPrice>
);
