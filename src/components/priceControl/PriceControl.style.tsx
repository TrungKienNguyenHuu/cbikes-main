import styled from "styled-components";
import { COLORS, BREAKPOINTS } from "../../common/constants";

export const StyledPriceControlWrapper = styled.div`
  position: relative;
  display: flex;
  height: 40px;
  width: 100%;
  flex-grow: 1;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    max-width: 100%;
  }
`;

export const StyledCount = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  color: white;
  mix-blend-mode: difference;
  font-size: 13px;
  font-weight: 600;
`;

export const StyledPriceControl = styled.input`
  -webkit-appearance: none;
  position: relative;
  overflow: hidden;
  height: 40px;
  width: 100%;
  cursor: pointer;
  border-radius: 20px;
  background: ${COLORS.backgroundLight};

  ::-webkit-slider-runnable-track {
    background: ${COLORS.border};
    height: 40px;
    border-radius: 20px;
  }
  
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0px;
    height: 40px;
    box-shadow: -500px 0 0 500px ${COLORS.primary};
    border: 2px solid ${COLORS.primary};
  }
  
  ::-moz-range-track {
    height: 40px;
    background: ${COLORS.border};
    border-radius: 20px;
  }
  
  ::-moz-range-thumb {
    background: ${COLORS.primary};
    border: 2px solid ${COLORS.primary};
    border-radius: 20px;
    height: 40px;
    cursor: pointer;
  }

  /* * NOTE: You have a duplicate ::-moz-range-thumb here. 
   * The rules below will overwrite the ones above. 
   */
  ::-moz-range-thumb {
    background: #000;
    height: 28px;
    width: 20px;
    border: 3px solid #000;
    border-radius: 0 !important;
    box-shadow: -200px 0 0 200px black;
    box-sizing: border-box;
  }
  ::-ms-fill-lower {
    background: black;
  }
  ::-ms-thumb {
    background: #000;
    border: 2px solid #000;
    height: 28px;
    width: 20px;
    box-sizing: border-box;
  }
  ::-ms-ticks-after {
    display: none;
  }
  ::-ms-ticks-before {
    display: none;
  }
  ::-ms-track {
    background: #000;
    color: transparent;
    height: 28px;
    border: none;
  }
  ::-ms-tooltip {
    display: none;
  }
`;