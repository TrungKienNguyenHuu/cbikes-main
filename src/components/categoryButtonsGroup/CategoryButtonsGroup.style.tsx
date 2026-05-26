import styled from "styled-components";

export const StyledCategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
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
    padding: 0.75rem 1rem;
    width: 100%;
    color: ${({ isChecked }) => (isChecked ? "#fff" : "#000")};
    background-color: ${({ isChecked }) => (isChecked ? "#000" : "#e5ebed")};
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s linear;
    
    @media (max-width: 768px) {
      padding: 5px 10px;
      border-radius: 50px;
      width: auto;
    }
  }
`;

