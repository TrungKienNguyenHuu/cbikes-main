import { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { COLORS, SPACING, BREAKPOINTS, SHADOWS } from "../../common/constants";
import { Bike } from "../../common/types";
import { FavoritesDropdown } from "./FavoritesDropdown";

interface IHeaderProps {
    title: string;
    favorites?: Bike[];
    searchTerm?: string;
    onSearch?: (term: string) => void;
}

// 1. Add transient prop type `$isHidden` so it doesn't get passed to the DOM
const HeaderContainer = styled.header<{ $isHidden: boolean }>`
  background-color: ${COLORS.background};
  border-bottom: 2px solid ${COLORS.borderLight};
  padding: ${SPACING.md} ${SPACING.lg};
  box-shadow: ${SHADOWS.sm};
  position: sticky;
  top: 0;
  z-index: 100;
  
  /* 2. Add transition and transform for smooth hiding/showing */
  transition: transform 0.3s ease-in-out;
  transform: translateY(${(props) => (props.$isHidden ? "-100%" : "0")});
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${SPACING.lg};

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
    gap: ${SPACING.md};
  }
`;

const Logo = styled.h1`
  font-weight: 900;
  margin: 0;
  padding: 0;
  color: ${COLORS.primary};
  font-size: 1.8rem;
  letter-spacing: -1px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    font-size: 1.4rem;
    text-align: center;
    width: 100%;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${SPACING.sm};
  flex: 1;
  max-width: 400px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    max-width: 100%;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${SPACING.sm};
  border: 2px solid ${COLORS.border};
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    width: 100%;
  }
`;

const SearchButton = styled.button`
  padding: ${SPACING.sm} ${SPACING.md};
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff5a1a;
  }
`;

const FavoritesWrapper = styled.div`
  position: relative;
`;

const CartBadge = styled.button`
  position: relative;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${COLORS.backgroundLight};
  border: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${COLORS.borderLight};
  }
`;

const BadgeCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${COLORS.error};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
`;

export const Header = memo(
    ({ title, favorites = [], searchTerm = "", onSearch }: IHeaderProps) => {
        const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
        const [isHidden, setIsHidden] = useState(false); // State to handle visibility

        const favoritesRef = useRef<HTMLDivElement>(null);
        const lastScrollY = useRef(0); // Track previous scroll position

        // Handle Favorites dropdown clicking outside
        useEffect(() => {
            if (!isFavoritesOpen) return;

            const handleClickOutside = (event: MouseEvent) => {
                if (
                    favoritesRef.current &&
                    !favoritesRef.current.contains(event.target as Node)
                ) {
                    setIsFavoritesOpen(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [isFavoritesOpen]);

        // Handle Scroll for Header visibility
        useEffect(() => {
            const handleScroll = () => {
                const currentScrollY = window.scrollY;

                // If scrolling down and past 80px, hide the header
                if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                    setIsHidden(true);
                } else if (currentScrollY < lastScrollY.current) {
                    // If scrolling up, show the header
                    setIsHidden(false);
                }

                lastScrollY.current = currentScrollY;
            };

            // Use passive: true for better scrolling performance
            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
        }, []);

        return (
            <HeaderContainer $isHidden={isHidden}>
                <HeaderContent>
                    <Logo>{title}</Logo>
                    <SearchContainer>
                        <SearchInput
                            type="text"
                            placeholder="Search bikes by name or specs..."
                            aria-label="Search bikes"
                            value={searchTerm}
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                        <SearchButton onClick={() => onSearch?.(searchTerm)}>Search</SearchButton>
                    </SearchContainer>
                    <FavoritesWrapper ref={favoritesRef}>
                        <CartBadge
                            type="button"
                            title="Favorite Products"
                            aria-label="Favorite products"
                            onClick={() => setIsFavoritesOpen((prev) => !prev)}
                        >
                            🛒
                            {favorites.length > 0 && <BadgeCount>{favorites.length}</BadgeCount>}
                        </CartBadge>
                        <FavoritesDropdown
                            favorites={favorites}
                            isOpen={isFavoritesOpen}
                            onClose={() => setIsFavoritesOpen(false)}
                        />
                    </FavoritesWrapper>
                </HeaderContent>
            </HeaderContainer>
        );
    }
);