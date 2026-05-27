import styled from "styled-components";
import { COLORS, SHADOWS, SPACING, BREAKPOINTS } from "../../common/constants";

export const StyledBikesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${SPACING.lg};
  margin-top: ${SPACING.lg};
  flex: 1;

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
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    height: 140px;
    margin-bottom: ${SPACING.sm};
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