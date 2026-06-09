import { memo, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { COLORS, SPACING, BREAKPOINTS } from "../../common/constants";

export interface FilterItem {
  id: string;
  name: string;
}

interface BrandFilterDropdownProps {
  items: FilterItem[];
  currentValue: string;
  onChange: (itemId: string) => void;
  placeholder?: string;
}

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: ${SPACING.sm} ${SPACING.md};
  background-color: ${COLORS.backgroundLight};
  border: 2px solid ${COLORS.border};
  border-radius: 8px;
  color: ${COLORS.text};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${SPACING.sm};
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    border-color: ${COLORS.primary};
    background-color: ${COLORS.hover};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 3px rgba(255, 90, 26, 0.1);
  }

  ${({ isOpen }) => isOpen && `
    border-color: ${COLORS.primary};
    background-color: ${COLORS.hover};
  `}

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
    flex-shrink: 0;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid ${COLORS.primary};
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  margin-top: 4px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${COLORS.backgroundLight};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${COLORS.border};
    border-radius: 4px;

    &:hover {
      background: ${COLORS.textLight};
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${SPACING.sm} ${SPACING.md};
  border: none;
  border-bottom: 1px solid ${COLORS.borderLight};
  font-size: 0.9rem;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;

  &:focus {
    outline: none;
    background-color: ${COLORS.backgroundLight};
  }

  &::placeholder {
    color: ${COLORS.textLight};
  }
`;

const DropdownItem = styled.button<{ isSelected: boolean }>`
  width: 100%;
  padding: ${SPACING.sm} ${SPACING.md};
  background: ${({ isSelected }) => (isSelected ? COLORS.primary : "white")};
  color: ${({ isSelected }) => (isSelected ? "white" : COLORS.text)};
  border: none;
  text-align: left;
  cursor: pointer;
  font-weight: ${({ isSelected }) => (isSelected ? "700" : "500")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? COLORS.primary : COLORS.backgroundLight)};
  }

  input {
    pointer-events: none;
  }
`;

const NoResults = styled.div`
  padding: ${SPACING.md};
  text-align: center;
  color: ${COLORS.textLight};
  font-size: 0.9rem;
`;

const SelectedBadge = styled.span`
  display: inline-block;
  background-color: ${COLORS.primary};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: auto;
`;

export const BrandFilterDropdown = memo(
  ({
    items,
    currentValue,
    onChange,
    placeholder = "Select a brand",
  }: BrandFilterDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter items based on search term
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get the display name for the selected value
    const selectedItem = items.find((item) => item.id === currentValue);
    const displayName =
      currentValue === "all" ? placeholder : selectedItem?.name || placeholder;

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown after selection
    const handleSelect = (itemId: string) => {
      onChange(itemId);
      setIsOpen(false);
      setSearchTerm("");
    };

    return (
      <DropdownContainer ref={containerRef}>
        <DropdownButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>{displayName}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </DropdownButton>

        <DropdownMenu isOpen={isOpen}>
          <SearchInput
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <DropdownItem
                key={item.id}
                isSelected={item.id === currentValue}
                onClick={() => handleSelect(item.id)}
              >
                <input
                  type="radio"
                  checked={item.id === currentValue}
                  readOnly
                />
                <span>{item.name}</span>
                {item.id === currentValue && <SelectedBadge>✓</SelectedBadge>}
              </DropdownItem>
            ))
          ) : (
            <NoResults>No brands found</NoResults>
          )}
        </DropdownMenu>
      </DropdownContainer>
    );
  }
);

BrandFilterDropdown.displayName = "BrandFilterDropdown";
