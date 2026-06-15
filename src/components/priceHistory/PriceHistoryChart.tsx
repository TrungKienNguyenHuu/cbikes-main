import styled from "styled-components";
import { PriceHistoryPoint } from "../../common/types";

const ChartContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  color: #333;
`;

const SVGWrapper = styled.div`
  overflow-x: auto;
`;

const Legend = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

interface PriceHistoryChartProps {
  priceHistory?: PriceHistoryPoint[];
  currentPrice: number;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  priceHistory,
  currentPrice,
}) => {
  // Return null if no price history data
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>Price History</ChartTitle>
        <div style={{ color: "#999", fontSize: "0.9rem" }}>
          No price history data available
        </div>
      </ChartContainer>
    );
  }

  // Chart dimensions
  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate min and max prices with some padding
  const prices = priceHistory.map((p) => p.price);
  const minPrice = Math.min(...prices, currentPrice);
  const maxPrice = Math.max(...prices, currentPrice);
  const priceRange = maxPrice - minPrice || 1;
  const pricePadding = priceRange * 0.1;

  const yMin = minPrice - pricePadding;
  const yMax = maxPrice + pricePadding;
  const yRange = yMax - yMin;

  // Scale functions
  const scaleX = (index: number) =>
    padding.left + (index / (priceHistory.length - 1 || 1)) * chartWidth;

  const scaleY = (price: number) =>
    padding.top +
    chartHeight -
    ((price - yMin) / yRange) * chartHeight;

  // Generate SVG path
  const pathData = priceHistory
    .map((point, index) => {
      const x = scaleX(index);
      const y = scaleY(point.price);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Format price
  const formatPrice = (price: number) => `₫${price.toLocaleString()}`;

  return (
    <ChartContainer>
      <ChartTitle>Price History</ChartTitle>
      <SVGWrapper>
        <svg
          width={width}
          height={height}
          style={{ border: "1px solid #e0e0e0", borderRadius: "4px" }}
        >
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y =
              padding.top +
              (chartHeight / 4) * i;
            const price = yMax - ((yMax - yMin) / 4) * i;
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#999"
                >
                  {formatPrice(price)}
                </text>
              </g>
            );
          })}

          {/* X-axis */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={width - padding.right}
            y2={padding.top + chartHeight}
            stroke="#333"
            strokeWidth="1"
          />

          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke="#333"
            strokeWidth="1"
          />

          {/* Price history line */}
          <path
            d={pathData}
            fill="none"
            stroke="#ff6b35"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {priceHistory.map((point, index) => {
            const x = scaleX(index);
            const y = scaleY(point.price);
            return (
              <circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill="#ff6b35"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* X-axis labels */}
          {priceHistory.map((point, index) => {
            // Show every nth label to avoid crowding
            const showLabel =
              priceHistory.length <= 5 ||
              index % Math.ceil(priceHistory.length / 5) === 0 ||
              index === priceHistory.length - 1;
            if (!showLabel) return null;

            const x = scaleX(index);
            const y = padding.top + chartHeight + 20;
            return (
              <text
                key={`label-${index}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="12"
                fill="#666"
              >
                {formatDate(point.date)}
              </text>
            );
          })}

          {/* Tooltip background for hover */}
          {priceHistory.map((point, index) => {
            const x = scaleX(index);
            const y = scaleY(point.price);
            return (
              <g
                key={`tooltip-bg-${index}`}
                opacity="0"
                style={{ pointerEvents: "auto" }}
              >
                <circle cx={x} cy={y} r="12" fill="white" opacity="0.01" />
              </g>
            );
          })}
        </svg>
      </SVGWrapper>

      <Legend>
        <LegendItem>
          <LegendDot color="#ff6b35" />
          <span>Price History</span>
        </LegendItem>
      </Legend>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
        <div>Data points: {priceHistory.length}</div>
        <div>
          Lowest: <strong>{formatPrice(minPrice)}</strong>
        </div>
        <div>
          Highest: <strong>{formatPrice(maxPrice)}</strong>
        </div>
        <div>
          Current: <strong>{formatPrice(currentPrice)}</strong>
        </div>
      </div>
    </ChartContainer>
  );
};
