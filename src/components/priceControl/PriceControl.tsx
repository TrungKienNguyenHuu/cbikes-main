import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  PRICE_RANGE_PRESETS,
  PRICE_SLIDER_STEP,
  DEFAULT_MIN_RANGE,
  DEFAULT_MAX_RANGE,
} from "../../common/constants";
import { PriceDisplay } from "../common/PriceDisplay";
import {
  formatVNDNumber,
  parseVNDInput,
} from "../../utils/formatPrice";
import {
  SLIDER_MAX,
  SLIDER_MIN,
  StyledInputField,
  StyledInputLabel,
  StyledManualInputs,
  StyledPresetButton,
  StyledPresetGrid,
  StyledPriceControlSection,
  StyledPriceInput,
  StyledPriceSectionTitle,
  StyledPriceSlider,
  StyledRangeLabel,
  StyledRangeSummary,
  StyledSliderBounds,
  StyledSliderGroup,
  StyledSliderHeader,
  StyledSliderRow,
} from "./PriceControl.style";

interface IProps {
  minPrice: number;
  maxPrice: number;
  pricePreset: string;
  onPresetChange: (presetId: string) => void;
  onMinPriceChange: (minPrice: number) => void;
  onMaxPriceChange: (maxPrice: number) => void;
}

export const PriceControl = memo(
  ({
    minPrice,
    maxPrice,
    pricePreset,
    onPresetChange,
    onMinPriceChange,
    onMaxPriceChange,
  }: IProps) => {
    const [localMin, setLocalMin] = useState(minPrice);
    const [localMax, setLocalMax] = useState(maxPrice);
    const [minInput, setMinInput] = useState(formatVNDNumber(minPrice));
    const [maxInput, setMaxInput] = useState(formatVNDNumber(maxPrice));
    const isDraggingRef = useRef(false);
    const localMinRef = useRef(minPrice);
    const localMaxRef = useRef(maxPrice);

    useEffect(() => {
      localMinRef.current = localMin;
      localMaxRef.current = localMax;
    }, [localMin, localMax]);

    useEffect(() => {
      if (!isDraggingRef.current) {
        setLocalMin(minPrice);
        setLocalMax(maxPrice);
        setMinInput(formatVNDNumber(minPrice));
        setMaxInput(formatVNDNumber(maxPrice));
      }
    }, [minPrice, maxPrice]);

    const handleMinSlider = useCallback(
      (value: number) => {
        const nextMin = Math.min(value, localMax - PRICE_SLIDER_STEP);
        setLocalMin(Math.max(SLIDER_MIN, nextMin));
      },
      [localMax]
    );

    const handleMaxSlider = useCallback(
      (value: number) => {
        const nextMax = Math.max(value, localMin + PRICE_SLIDER_STEP);
        setLocalMax(Math.min(SLIDER_MAX, nextMax));
      },
      [localMin]
    );

    const commitSliderValues = useCallback(() => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const nextMin = localMinRef.current;
      const nextMax = localMaxRef.current;
      onMinPriceChange(nextMin);
      onMaxPriceChange(nextMax);
      setMinInput(formatVNDNumber(nextMin));
      setMaxInput(formatVNDNumber(nextMax));
    }, [onMinPriceChange, onMaxPriceChange]);

    const startDragging = useCallback(() => {
      isDraggingRef.current = true;

      const handleGlobalPointerUp = () => {
        commitSliderValues();
        document.removeEventListener("pointerup", handleGlobalPointerUp);
      };

      document.addEventListener("pointerup", handleGlobalPointerUp);
    }, [commitSliderValues]);

    const commitMinInput = useCallback(() => {
      const parsed = parseVNDInput(minInput);
      const clamped = Math.max(
        SLIDER_MIN,
        Math.min(parsed, localMax - PRICE_SLIDER_STEP)
      );
      setLocalMin(clamped);
      onMinPriceChange(clamped);
      setMinInput(formatVNDNumber(clamped));
    }, [localMax, minInput, onMinPriceChange]);

    const commitMaxInput = useCallback(() => {
      const parsed = parseVNDInput(maxInput);
      const clamped = Math.min(
        SLIDER_MAX,
        Math.max(parsed, localMin + PRICE_SLIDER_STEP)
      );
      setLocalMax(clamped);
      onMaxPriceChange(clamped);
      setMaxInput(formatVNDNumber(clamped));
    }, [maxInput, localMin, onMaxPriceChange]);

    const isCustom = pricePreset === "custom";

    return (
      <StyledPriceControlSection>
        <StyledPriceSectionTitle>Price Range</StyledPriceSectionTitle>

        <StyledPresetGrid>
          {PRICE_RANGE_PRESETS.map((preset) => (
            <StyledPresetButton
              key={preset.id}
              type="button"
              $active={pricePreset === preset.id}
              onClick={() => onPresetChange(preset.id)}
            >
              {preset.label}
            </StyledPresetButton>
          ))}
          <StyledPresetButton
            type="button"
            $active={isCustom}
            onClick={() => onPresetChange("custom")}
          >
            Custom
          </StyledPresetButton>
        </StyledPresetGrid>

        <StyledRangeSummary>
          <StyledRangeLabel>Showing</StyledRangeLabel>
          <span>
            <PriceDisplay price={localMin} size="sm" /> –{" "}
            <PriceDisplay price={localMax} size="sm" />
          </span>
        </StyledRangeSummary>

        <StyledSliderGroup>
          <StyledSliderRow>
            <StyledSliderHeader>
              <span>Minimum</span>
              <PriceDisplay price={localMin} size="sm" />
            </StyledSliderHeader>
            <StyledPriceSlider
              type="range"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={PRICE_SLIDER_STEP}
              value={localMin}
              onPointerDown={startDragging}
              onChange={(e) => handleMinSlider(Number(e.target.value))}
            />
          </StyledSliderRow>

          <StyledSliderRow>
            <StyledSliderHeader>
              <span>Maximum</span>
              <PriceDisplay price={localMax} size="sm" />
            </StyledSliderHeader>
            <StyledPriceSlider
              type="range"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={PRICE_SLIDER_STEP}
              value={localMax}
              onPointerDown={startDragging}
              onChange={(e) => handleMaxSlider(Number(e.target.value))}
            />
          </StyledSliderRow>

          <StyledSliderBounds>
            <span>{formatVNDNumber(DEFAULT_MIN_RANGE)}₫</span>
            <span>{formatVNDNumber(DEFAULT_MAX_RANGE)}₫</span>
          </StyledSliderBounds>
        </StyledSliderGroup>

        <StyledManualInputs>
          <StyledInputField>
            <StyledInputLabel htmlFor="price-min">Min price</StyledInputLabel>
            <StyledPriceInput
              id="price-min"
              type="text"
              inputMode="numeric"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={commitMinInput}
              onKeyDown={(e) => e.key === "Enter" && commitMinInput()}
            />
          </StyledInputField>
          <StyledInputField>
            <StyledInputLabel htmlFor="price-max">Max price</StyledInputLabel>
            <StyledPriceInput
              id="price-max"
              type="text"
              inputMode="numeric"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={commitMaxInput}
              onKeyDown={(e) => e.key === "Enter" && commitMaxInput()}
            />
          </StyledInputField>
        </StyledManualInputs>
      </StyledPriceControlSection>
    );
  }
);
