import { memo, ReactNode } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  position: sticky;
  top: 1rem;
  height: fit-content;
  min-width: 250px;

  @media (max-width: 768px) {
    flex-direction: column;
    min-width: 100%;
    position: static;
  }
`;

export const Filter = memo(({ children }: { children: ReactNode }) => (
  <StyledForm>{children}</StyledForm>
));
