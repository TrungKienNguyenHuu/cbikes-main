import styled from "styled-components";
import { COLORS, SHADOWS, SPACING, BREAKPOINTS } from "../../common/constants";

export const StyledBikesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${SPACING.lg};
  margin-top: ${SPACING.lg};
  flex: 1;
    align-items: start;  
    
  @media (max-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${SPACING.md};
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${SPACING.sm};
  }
`;

export const StyledBikeCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.background};
  border: 2px solid ${COLORS.borderLight};
  border-radius: 12px;
  padding: ${SPACING.md};
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${SHADOWS.sm};

  &:hover {
    transform: translateY(-8px);
    border-color: ${COLORS.primary};
    box-shadow: ${SHADOWS.lg};
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: ${SPACING.sm};
  }
`;

export const StyledBikeImage = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 180px;
  background-color: ${COLORS.backgroundLight};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: ${SPACING.md};
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: filter 0.3s ease, transform 0.3s ease;
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    height: 140px;
    margin-bottom: ${SPACING.sm};
  }
`;

export const StyledImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  background: rgba(255, 255, 255, 0.15);
`;

export const StyledFavoriteButton = styled.button<{ isFavorite: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${({ isFavorite }) => (isFavorite ? COLORS.error : COLORS.background)};
  color: ${({ isFavorite }) => (isFavorite ? "#fff" : COLORS.primary)};
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: ${SHADOWS.md};
  transition: transform 0.2s ease, background-color 0.2s ease;
  z-index: 2;

  &:hover {
    transform: scale(1.08);
  }
`;

export const StyledBikeCardWithHover = styled(StyledBikeCard)`
  &:hover ${StyledBikeImage} img {
    filter: blur(4px);
    transform: scale(1.02);
  }

  &:hover ${StyledImageOverlay} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const StyledBottomOfBikeCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  flex: 1;

  h3 {
    margin: 0;
    font-size: 0.95rem;
    color: ${COLORS.text};
    line-height: 1.4;
    min-height: 2.8em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 0.85rem;
    }
  }

  span {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${COLORS.primary};
    margin-bottom: ${SPACING.sm};

    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 1rem;
    }
  }

  button {
    width: 100%;
    padding: ${SPACING.sm};
    background-color: ${COLORS.primary};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;

    &:hover {
      background-color: #ff5a1a;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.98);
    }

    @media (max-width: ${BREAKPOINTS.tablet}) {
      padding: 8px;
      font-size: 0.85rem;
    }
  }
`;

export const StyledSellerCountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #27ae60;
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: ${SPACING.xs || "0.25rem"};
  min-height: 1.2rem;
  
  @media (max-width: ${BREAKPOINTS.tablet}) {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
`;