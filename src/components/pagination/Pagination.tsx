import styled from "styled-components";
import { COLORS, SPACING, BREAKPOINTS } from "../../common/constants";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${SPACING.sm};
  margin-top: ${SPACING.lg};
  padding: ${SPACING.lg} 0;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    gap: 4px;
    flex-wrap: wrap;
  }
`;

interface PageButtonProps {
  isActive?: boolean;
  isDisabled?: boolean;
}

const PageButton = styled.button<PageButtonProps>`
  min-width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid ${(props) => (props.isActive ? COLORS.primary : COLORS.border)};
  background-color: ${(props) => (props.isActive ? COLORS.primary : "white")};
  color: ${(props) => (props.isActive ? "white" : COLORS.text)};
  border-radius: 6px;
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background-color: ${COLORS.primary};
    color: white;
    border-color: ${COLORS.primary};
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    min-width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }
`;

const Ellipsis = styled.span`
  padding: 0 ${SPACING.sm};
  color: ${COLORS.textLight};
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show pages around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </PageButton>

      {getPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <Ellipsis key={`ellipsis-${index}`}>{page}</Ellipsis>
        ) : (
          <PageButton
            key={page}
            isActive={page === currentPage}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PageButton>
        )
      )}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </PageButton>
    </PaginationContainer>
  );
};
