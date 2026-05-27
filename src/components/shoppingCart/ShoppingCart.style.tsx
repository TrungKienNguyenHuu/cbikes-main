import styled from "styled-components";
import { COLORS, SHADOWS, SPACING, BREAKPOINTS } from "../../common/constants";

export const StyledShoppingCart = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  z-index: 100;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${SPACING.md};
  background: ${COLORS.background};
  border-top: 2px solid ${COLORS.borderLight};
  box-shadow: ${SHADOWS.lg};
  gap: ${SPACING.md};

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: ${SPACING.sm};
    gap: ${SPACING.sm};
  }
`;

export const StyledScrollingList = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100%;
  height: auto;
  gap: ${SPACING.sm};

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${COLORS.backgroundLight};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${COLORS.primary};
    border-radius: 10px;

    &:hover {
      background: #ff5a1a;
    }
  }
`;

export const StyledCartItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${SPACING.md};
  min-width: 160px;
  height: auto;
  border-radius: 10px;
  background: ${COLORS.backgroundLight};
  border: 1px solid ${COLORS.border};
  box-shadow: ${SHADOWS.sm};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${SHADOWS.md};
    border-color: ${COLORS.primary};
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    min-width: 140px;
    padding: ${SPACING.sm};
  }
`;

export const StyledCartImg = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${SPACING.sm};
  background: white;
  border-radius: 8px;

  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
`;

export const StyledTitle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;

  h5 {
    margin: 0;
    font-size: 0.85rem;
    word-break: break-word;
    color: ${COLORS.text};
    line-height: 1.3;
  }

  span {
    font-size: 0.9rem;
    font-weight: 700;
    color: ${COLORS.primary};
  }
`;

export const StyledDeleteButton = styled.button`
  position: absolute;
  right: -10px;
  top: -10px;
  width: 24px;
  height: 24px;
  padding: 0;
  transition: all 0.2s ease;
  color: white;
  border: 0;
  border-radius: 50%;
  background: ${COLORS.error};
  font-size: 0.7rem;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.15);
    background: #c0392b;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const StyledOrderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 140px;
  padding: ${SPACING.md} ${SPACING.lg};
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 8px;
  background: ${COLORS.primary};
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  cursor: pointer;

  &:hover {
    background: #ff5a1a;
    transform: scale(1.05);
    box-shadow: ${SHADOWS.md};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    min-width: 120px;
    padding: ${SPACING.sm} ${SPACING.md};
    font-size: 0.8rem;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    min-width: 100px;
    padding: 8px 12px;
  }
`;
