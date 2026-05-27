import styled from "styled-components";
import { COLORS, SPACING, BREAKPOINTS } from "../../common/constants";

export const StyledCategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  width: 100%;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${SPACING.xs};
  }
`;

export const StyledCategoryItem = styled.div<{ isChecked: boolean }>`
  display: flex;
  flex-grow: 1;

  input {
    position: absolute;
    opacity: 0;
    z-index: -1000;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${SPACING.sm} ${SPACING.md};
    width: 100%;
    color: ${({ isChecked }) => (isChecked ? "white" : COLORS.text)};
    background-color: ${({ isChecked }) => (isChecked ? COLORS.primary : COLORS.backgroundLight)};
    border: 2px solid ${({ isChecked }) => (isChecked ? COLORS.primary : COLORS.border)};
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: ${COLORS.primary};
      background-color: ${({ isChecked }) => (isChecked ? COLORS.primary : COLORS.hover)};
    }
    
    @media (max-width: ${BREAKPOINTS.tablet}) {
      padding: 8px 16px;
      border-radius: 50px;
      width: auto;
      font-size: 0.9rem;
    }
  }
`;

