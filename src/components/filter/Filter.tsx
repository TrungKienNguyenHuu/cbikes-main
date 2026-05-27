import { memo, ReactNode } from "react";
import styled from "styled-components";
import { COLORS, SHADOWS, SPACING, BREAKPOINTS } from "../../common/constants";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.lg};
  padding: ${SPACING.lg};
  background: ${COLORS.background};
  border: 2px solid ${COLORS.borderLight};
  border-radius: 12px;
  position: sticky;
  top: ${SPACING.lg};
  height: fit-content;
  min-width: 280px;
  box-shadow: ${SHADOWS.sm};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${COLORS.primary};
    box-shadow: ${SHADOWS.md};
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
    min-width: 100%;
    position: static;
    gap: ${SPACING.md};
  }
`;

const FilterTitle = styled.h3`
  margin: 0 0 ${SPACING.md} 0;
  color: ${COLORS.text};
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};

  &::before {
    content: "🔍";
    font-size: 1.3rem;
  }
`;

export const Filter = memo(({ children }: { children: ReactNode }) => (
  <StyledForm>
    <FilterTitle>Filters</FilterTitle>
    {children}
  </StyledForm>
));
