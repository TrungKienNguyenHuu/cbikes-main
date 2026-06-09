import { memo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMG_PATH, COLORS, SPACING, SHADOWS } from "../../common/constants";
import { Bike } from "../../common/types";

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  max-height: 360px;
  overflow-y: auto;
  background: ${COLORS.background};
  border: 1px solid ${COLORS.border};
  border-radius: 10px;
  box-shadow: ${SHADOWS.lg};
  z-index: 200;
`;

const DropdownTitle = styled.h4`
  margin: 0;
  padding: ${SPACING.sm} ${SPACING.md};
  font-size: 0.9rem;
  color: ${COLORS.text};
  border-bottom: 1px solid ${COLORS.borderLight};
`;

const EmptyMessage = styled.p`
  margin: 0;
  padding: ${SPACING.md};
  font-size: 0.9rem;
  color: ${COLORS.textLight};
`;

const FavoriteItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
  padding: ${SPACING.sm} ${SPACING.md};
  border: none;
  border-bottom: 1px solid ${COLORS.borderLight};
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${COLORS.backgroundLight};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const FavoriteImage = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 6px;
  background: ${COLORS.backgroundLight};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const FavoriteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const FavoriteName = styled.span`
  font-size: 0.85rem;
  color: ${COLORS.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FavoritePrice = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${COLORS.primary};
`;

const getImageSource = (imgSrc: string) =>
  imgSrc.startsWith("http://") ||
  imgSrc.startsWith("https://") ||
  imgSrc.startsWith("data:") ||
  imgSrc.startsWith("/")
    ? imgSrc
    : `${IMG_PATH}${imgSrc}`;

interface FavoritesDropdownProps {
  favorites: Bike[];
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesDropdown = memo(
  ({ favorites, isOpen, onClose }: FavoritesDropdownProps) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleItemClick = (bikeId: string) => {
      navigate(`/product/${bikeId}`);
      onClose();
    };

    return (
      <Dropdown>
        <DropdownTitle>Favorite Products</DropdownTitle>
        {favorites.length === 0 ? (
          <EmptyMessage>No favorite products yet.</EmptyMessage>
        ) : (
          favorites.map((bike) => (
            <FavoriteItem key={bike.id} onClick={() => handleItemClick(bike.id)}>
              <FavoriteImage>
                <img src={getImageSource(bike.imgSrc)} alt={bike.name} />
              </FavoriteImage>
              <FavoriteInfo>
                <FavoriteName>{bike.name}</FavoriteName>
                <FavoritePrice>${bike.price}</FavoritePrice>
              </FavoriteInfo>
            </FavoriteItem>
          ))
        )}
      </Dropdown>
    );
  }
);
