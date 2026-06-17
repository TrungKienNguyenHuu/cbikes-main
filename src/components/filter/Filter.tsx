import { memo, ReactNode } from "react";
import styled from "styled-components";
import { COLORS, SHADOWS, SPACING, BREAKPOINTS, LAYOUT } from "../../common/constants";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  background: ${COLORS.background};
  border: 2px solid ${COLORS.borderLight};
  border-radius: 12px;
  position: sticky;
  top: ${LAYOUT.stickyHeaderOffset};
  align-self: flex-start;
  flex: 0 0 250px;
  width: 250px;
  padding: ${SPACING.md};
  overflow: visible;
  box-shadow: ${SHADOWS.sm};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  z-index: 10;

  &:hover {
    border-color: ${COLORS.primary};
    box-shadow: ${SHADOWS.md};
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex: 1 1 auto;
    width: 100%;
    position: static;
  }
`;

const FilterTitle = styled.h3`
  margin: 0 0 ${SPACING.xs} 0;
  color: ${COLORS.text};
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${SPACING.xs};

  &::before {
    content: "🔍";
    font-size: 1.1rem;
  }
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const FilterSectionTitle = styled.h4`
  margin: 0;
  color: ${COLORS.text};
  font-size: 0.82rem;
  font-weight: 700;
`;

interface FilterProps {
  children: ReactNode;
}

export const Filter = memo(({ children }: FilterProps) => (
  <StyledForm>
    <FilterTitle>Filters</FilterTitle>
    {children}
  </StyledForm>
));
