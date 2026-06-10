import { memo } from "react";
import {
  StyledCategoryWrapper,
  StyledCategoryItem,
} from "./CategoryButtonsGroup.style";

export interface CategoryItem {
  id: string;
  name: string;
}

interface IProps {
  categories?: CategoryItem[]; 
  currentCategory: string;
  handleCurrentCategory: (categoryId: string) => void;
}

export const CategoryButtonsGroup = memo(
  ({ categories = [], currentCategory, handleCurrentCategory }: IProps) => {
    
    // 1. Automatically inject the "All" category at the start if it doesn't exist
    const displayCategories = categories.some((c) => c.id === "all")
      ? categories
      : [{ id: "all", name: "All" }, ...categories];

    // 2. Handle category click with toggle functionality
    const handleCategoryClick = (categoryId: string) => {
      if (currentCategory === categoryId) {
        // If clicking the same category, deselect it and go back to "all"
        handleCurrentCategory("all");
      } else {
        // Otherwise, select the new category
        handleCurrentCategory(categoryId);
      }
    };

    return (
      <StyledCategoryWrapper>
        {/* 2. Map over our guaranteed displayCategories instead of the raw prop */}
        {displayCategories.map((category) => {
          const isChecked = category.id === currentCategory;

          return (
            <StyledCategoryItem
              key={category.id}
              isChecked={isChecked}
              onClick={() => handleCategoryClick(category.id)}
              title={isChecked && category.id !== "all" ? "Click again to deselect" : ""}
            >
              <input
                onChange={() => null}
                type="radio"
                id={category.id}
                checked={isChecked}
              />
              <label>{category.name}</label>
            </StyledCategoryItem>
          );
        })}
      </StyledCategoryWrapper>
    );
  }
);