import styled from "styled-components";
import {
  COLORS,
  SPACING,
  BREAKPOINTS,
  DEFAULT_MIN_RANGE,
  DEFAULT_MAX_RANGE,
} from "../../common/constants";

export const StyledPriceControlSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0;
`;

export const StyledPriceSectionTitle = styled.h4`
  margin: 0;
  color: ${COLORS.text};
  font-size: 0.82rem;
  font-weight: 700;
`;

export const StyledPresetGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const StyledPresetButton = styled.button<{ $active: boolean }>`
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) => ($active ? COLORS.primary : COLORS.border)};
  background: ${({ $active }) =>
    $active ? COLORS.primary : COLORS.background};
  color: ${({ $active }) => ($active ? "#fff" : COLORS.textLight)};
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${COLORS.primary};
    color: ${({ $active }) => ($active ? "#fff" : COLORS.primary)};
  }
`;

export const StyledRangeSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${SPACING.xs};
  padding: 0.65rem 0.75rem;
  background: ${COLORS.backgroundLight};
  border: 1px solid ${COLORS.borderLight};
  border-radius: 8px;
  font-size: 0.8rem;
  color: ${COLORS.textLight};
`;

export const StyledRangeLabel = styled.span`
  font-weight: 600;
  color: ${COLORS.text};
`;

export const StyledSliderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const StyledSliderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const StyledSliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${COLORS.textLight};
  font-weight: 600;
`;

export const StyledPriceSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: ${COLORS.border};
  outline: none;
  cursor: pointer;
  touch-action: none;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${COLORS.primary};
    border: 2px solid #fff;
    box-shadow: ${COLORS.primary}40 0 2px 6px;
    cursor: pointer;
  }

  ::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${COLORS.primary};
    border: 2px solid #fff;
    box-shadow: ${COLORS.primary}40 0 2px 6px;
    cursor: pointer;
  }

  ::-moz-range-track {
    height: 6px;
    border-radius: 999px;
    background: ${COLORS.border};
  }
`;

export const StyledManualInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const StyledInputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StyledInputLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${COLORS.textLight};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const StyledPriceInput = styled.input`
  width: 100%;
  padding: 0.45rem 0.55rem;
  border: 1px solid ${COLORS.border};
  border-radius: 6px;
  font-size: 0.85rem;
  color: ${COLORS.text};
  background: ${COLORS.background};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px ${COLORS.primary}22;
  }
`;

export const StyledSliderBounds = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: ${COLORS.textLighter};
  margin-top: -0.25rem;
`;

export const SLIDER_MIN = DEFAULT_MIN_RANGE;
export const SLIDER_MAX = DEFAULT_MAX_RANGE;
