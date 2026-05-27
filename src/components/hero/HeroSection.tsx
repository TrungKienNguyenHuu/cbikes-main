import styled from "styled-components";
import { COLORS, SPACING, BREAKPOINTS, SHADOWS } from "../../common/constants";

const HeroContainer = styled.div`
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
  color: white;
  padding: ${SPACING.xl} ${SPACING.lg};
  text-align: center;
  margin-bottom: ${SPACING.lg};

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: ${SPACING.lg} ${SPACING.md};
    margin-bottom: ${SPACING.md};
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin: 0 0 ${SPACING.md} 0;
  font-weight: 700;
  letter-spacing: -1px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin: 0 0 ${SPACING.lg} 0;
  opacity: 0.95;
  font-weight: 300;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    font-size: 1rem;
  }
`;

const HeroFeatures = styled.div`
  display: flex;
  justify-content: center;
  gap: ${SPACING.xl};
  flex-wrap: wrap;
  margin-top: ${SPACING.lg};

  @media (max-width: ${BREAKPOINTS.tablet}) {
    gap: ${SPACING.md};
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${SPACING.sm};
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  height: 60px;
  width: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
`;

export const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle>Welcome to CBIKES</HeroTitle>
        <HeroSubtitle>Discover the latest electric bikes with premium quality and affordable prices</HeroSubtitle>
        
        <HeroFeatures>
          <FeatureItem>
            <FeatureIcon>🚲</FeatureIcon>
            <FeatureText>35+ Models</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>💳</FeatureIcon>
            <FeatureText>Best Prices</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureText>High Performance</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🚚</FeatureIcon>
            <FeatureText>Fast Delivery</FeatureText>
          </FeatureItem>
        </HeroFeatures>
      </HeroContent>
    </HeroContainer>
  );
};
