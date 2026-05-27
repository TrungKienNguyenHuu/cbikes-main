import styled from "styled-components";
import { COLORS, SORT_OPTIONS, ITEMS_PER_PAGE_OPTIONS, SPACING, BREAKPOINTS } from "../../common/constants";
import { SortType } from "../../hooks/sorting.hook";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${SPACING.md};
  margin-bottom: ${SPACING.lg};
  padding: ${SPACING.md};
  background-color: ${COLORS.backgroundLight};
  border-radius: 8px;
  flex-wrap: wrap;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.md};

  @media (max-width: ${BREAKPOINTS.tablet}) {
    width: 100%;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: ${COLORS.text};
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${COLORS.border};
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${COLORS.primary};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
  }
`;

const ResultsInfo = styled.div`
  font-size: 0.9rem;
  color: ${COLORS.textLight};
  white-space: nowrap;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    width: 100%;
    text-align: center;
  }
`;

interface ToolbarProps {
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  totalResults: number;
  displayedResults: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  sortType,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalResults,
  displayedResults,
}) => {
  return (
    <ToolbarContainer>
      <ResultsInfo>
        Showing {displayedResults} of {totalResults} bikes
      </ResultsInfo>

      <ToolbarSection>
        <Label htmlFor="sort-select">Sort by:</Label>
        <Select
          id="sort-select"
          value={sortType}
          onChange={(e) => onSortChange(e.target.value as SortType)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </ToolbarSection>

      <ToolbarSection>
        <Label htmlFor="items-select">Items per page:</Label>
        <Select
          id="items-select"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </ToolbarSection>
    </ToolbarContainer>
  );
};
