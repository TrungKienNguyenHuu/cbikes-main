import styled from "styled-components";
import { BREAKPOINTS, COLORS, SPACING, WEB_APP_NAME } from "../../common/constants";

const FooterContainer = styled.footer`
  margin-top: ${SPACING.xl};
  width: 100%;
  border-top: 1px solid ${COLORS.borderLight};
  background: ${COLORS.backgroundLight};
`;

const FooterInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${SPACING.lg} ${SPACING.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${SPACING.md};

  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Brand = styled.div`
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${COLORS.text};
`;

const Meta = styled.div`
  color: ${COLORS.textLight};
  font-size: 0.95rem;
`;

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterInner>
        <Brand>{WEB_APP_NAME}</Brand>
        <Meta>© {year} {WEB_APP_NAME}. All rights reserved.</Meta>
      </FooterInner>
    </FooterContainer>
  );
};

