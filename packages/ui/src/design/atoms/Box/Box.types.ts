import { BoxProps as MUIBoxProps } from "@mui/material";
import { ReactNode } from "react";

export type BoxVariant =
  | "flex-fixed"
  | "flex-grow"
  | "vertical-centered"
  | "horizontal-centered"
  | "vertical-centered-full-width"
  | "horizontal-centered-full-width"
  | "card"
  | "sidebar"
  | "navbar"
  | "footer"
  | "container"
  | "grid-item"
  | "scroll-container";

export type BoxSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type BoxShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "inner";
export type BoxRounding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
export type BoxBorderStyle = "none" | "solid" | "dashed" | "dotted";

export interface BoxProps extends Omit<MUIBoxProps, "component"> {
  /**
   * The content of the Box component.
   */
  children?: ReactNode;

  /**
   * The HTML element used for the root node.
   * @default 'div'
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Additional className to be applied to the Box.
   */
  className?: string;

  /**
   * Different predefined styles for the Box component.
   */
  variant?: BoxVariant;

  /**
   * Padding size using theme spacing
   * @default 'none'
   */
  padding?: BoxSpacing;

  /**
   * Margin size using theme spacing
   * @default 'none'
   */
  margin?: BoxSpacing;

  /**
   * Shadow depth
   * @default 'none'
   */
  shadow?: BoxShadow;

  /**
   * Border radius size
   * @default 'none'
   */
  rounded?: BoxRounding;

  /**
   * Border configuration
   */
  border?: {
    width?: number;
    style?: BoxBorderStyle;
    color?: string;
  };

  /**
   * Background gradient configuration
   */
  gradient?: {
    start: string;
    end: string;
    direction?:
      | "to right"
      | "to left"
      | "to bottom"
      | "to top"
      | "to bottom right"
      | "to bottom left";
  };

  /**
   * Enable hover effects
   * @default false
   */
  hover?: boolean;

  /**
   * Cursor type when hovering
   * @default 'default'
   */
  cursor?:
    | "default"
    | "pointer"
    | "text"
    | "move"
    | "not-allowed"
    | "grab"
    | "grabbing";

  /**
   * Transition effects
   */
  transition?: {
    property?: string;
    duration?: string;
    easing?: string;
  };

  /**
   * Overflow behavior
   */
  overflow?: "visible" | "hidden" | "scroll" | "auto";

  /**
   * Display type
   */
  display?:
    | "block"
    | "inline"
    | "inline-block"
    | "flex"
    | "inline-flex"
    | "grid"
    | "none";

  /**
   * Position type
   */
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";

  /**
   * Z-index value
   */
  zIndex?: number;

  /**
   * Flex direction (when display is flex)
   */
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";

  /**
   * Flex wrap (when display is flex)
   */
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";

  /**
   * Justify content (when display is flex)
   */
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";

  /**
   * Align items (when display is flex)
   */
  alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";

  /**
   * Align content (when display is flex)
   */
  alignContent?:
    | "stretch"
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";

  /**
   * Gap between flex items
   */
  gap?: BoxSpacing | number;

  /**
   * Grid template columns (when display is grid)
   */
  gridTemplateColumns?: string;

  /**
   * Grid template rows (when display is grid)
   */
  gridTemplateRows?: string;

  /**
   * Grid column span
   */
  gridColumn?: string;

  /**
   * Grid row span
   */
  gridRow?: string;

  /**
   * Maximum width
   */
  maxWidth?: string | number;

  /**
   * Maximum height
   */
  maxHeight?: string | number;

  /**
   * Minimum width
   */
  minWidth?: string | number;

  /**
   * Minimum height
   */
  minHeight?: string | number;

  /**
   * Animation configuration
   */
  animation?: {
    name?: string;
    duration?: string;
    timing?: string;
    delay?: string;
    iteration?: string | number;
    direction?: string;
    fillMode?: string;
  };

  /**
   * Enable responsive behavior
   * @default false
   */
  responsive?: boolean;

  /**
   * Responsive breakpoint overrides
   */
  breakpoints?: {
    xs?: Partial<BoxProps>;
    sm?: Partial<BoxProps>;
    md?: Partial<BoxProps>;
    lg?: Partial<BoxProps>;
    xl?: Partial<BoxProps>;
  };

  /**
   * Accessibility role
   */
  role?: string;

  /**
   * ARIA label
   */
  ariaLabel?: string;

  /**
   * ARIA described by
   */
  ariaDescribedBy?: string;

  /**
   * Enable focus outline
   * @default false
   */
  focusable?: boolean;

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
