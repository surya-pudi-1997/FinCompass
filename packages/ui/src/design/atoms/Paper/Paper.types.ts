import { PaperProps as MUIPaperProps } from "@mui/material";
import { ReactNode } from "react";

export type PaperVariant =
  | "default"
  | "outlined"
  | "elevation"
  | "card"
  | "sidebar"
  | "dashboard"
  | "modal"
  | "tooltip";

export type PaperElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12 | 16 | 24;

export type PaperSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type PaperRounding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface PaperProps extends Omit<MUIPaperProps, "variant"> {
  /**
   * The content of the Paper component.
   */
  children?: ReactNode;

  /**
   * Additional className to be applied to the Paper.
   */
  className?: string;

  /**
   * Different predefined styles for the Paper component.
   * @default 'default'
   */
  variant?: PaperVariant;

  /**
   * Shadow depth, corresponds to `dp` in the spec.
   * It accepts values between 0 and 24 inclusive.
   * @default 1
   */
  elevation?: PaperElevation;

  /**
   * Padding size using theme spacing
   * @default 'none'
   */
  padding?: PaperSpacing;

  /**
   * Margin size using theme spacing
   * @default 'none'
   */
  margin?: PaperSpacing;

  /**
   * Border radius size
   * @default 'md'
   */
  rounded?: PaperRounding;

  /**
   * If `true`, the paper will be square (no border radius).
   * @default false
   */
  square?: boolean;

  /**
   * Maximum width of the paper
   */
  maxWidth?: string | number;

  /**
   * Maximum height of the paper
   */
  maxHeight?: string | number;

  /**
   * Minimum width of the paper
   */
  minWidth?: string | number;

  /**
   * Minimum height of the paper
   */
  minHeight?: string | number;

  /**
   * Width of the paper
   */
  width?: string | number;

  /**
   * Height of the paper
   */
  height?: string | number;

  /**
   * If `true`, the paper will have hover effects
   * @default false
   */
  hover?: boolean;

  /**
   * If `true`, the paper will be interactive (clickable)
   * @default false
   */
  interactive?: boolean;

  /**
   * Cursor style when hovering
   * @default 'default'
   */
  cursor?: "default" | "pointer" | "not-allowed" | "grab" | "grabbing";

  /**
   * Transition duration for hover effects
   * @default '0.2s'
   */
  transitionDuration?: string;

  /**
   * Background color override
   */
  backgroundColor?: string;

  /**
   * Border color for outlined variant
   */
  borderColor?: string;

  /**
   * Custom border width
   */
  borderWidth?: number;

  /**
   * Overflow behavior
   */
  overflow?: "visible" | "hidden" | "scroll" | "auto";

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * ARIA describedby for accessibility
   */
  ariaDescribedBy?: string;

  /**
   * Role for accessibility
   */
  role?: string;

  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Mouse enter handler
   */
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Mouse leave handler
   */
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Focus handler
   */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;

  /**
   * Blur handler
   */
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
}
