import { memo } from "react";
import styled from "styled-components";
import { COLORS, SPACING, BREAKPOINTS, SHADOWS } from "../../common/constants";

interface IHeaderProps {
  title: string;
  cartCount?: number;
}

const HeaderContainer = styled.header`
  background-color: ${COLORS.background};
  border-bottom: 2px solid ${COLORS.borderLight};
  padding: ${SPACING.md} ${SPACING.lg};
  box-shadow: ${SHADOWS.sm};
  position: sticky;
  top: 0;
  z-index: 100;
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

const CartBadge = styled.div`
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

export const Header = memo(({ title, cartCount = 0 }: IHeaderProps) => (
  <HeaderContainer>
    <HeaderContent>
      <Logo>{title}</Logo>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search bikes by name or specs..."
          aria-label="Search bikes"
        />
        <SearchButton>Search</SearchButton>
      </SearchContainer>
      <CartBadge title="Shopping Cart">
        🛒
        {cartCount > 0 && <BadgeCount>{cartCount}</BadgeCount>}
      </CartBadge>
    </HeaderContent>
  </HeaderContainer>
));
