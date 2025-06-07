import { TypographyProps as MUITypographyProps } from "@mui/material";

export type TypographyWeight =
  | "thin"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type TypographyAlign =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "start"
  | "end";

export type TypographySpacing =
  | "tight"
  | "normal"
  | "wide"
  | "wider"
  | "widest";

export type TypographySize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";

export type TypographyTransform =
  | "none"
  | "uppercase"
  | "lowercase"
  | "capitalize";

export type TypographyDecoration =
  | "none"
  | "underline"
  | "line-through"
  | "overline";

export type TypographyGradient = {
  from: string;
  to: string;
  direction?:
    | "to-r"
    | "to-l"
    | "to-t"
    | "to-b"
    | "to-br"
    | "to-bl"
    | "to-tr"
    | "to-tl";
};

export interface TypographyProps extends Omit<MUITypographyProps, "component"> {
  /**
   * Controls text truncation with ellipsis
   * @default false
   */
  ellipsis?: boolean;

  /**
   * Maximum number of lines before truncating with ellipsis
   * Only works when ellipsis is true
   * @default 1
   */
  maxLines?: number;

  /**
   * Text decoration style
   */
  decoration?: TypographyDecoration;

  /**
   * If true, text will be selectable
   * @default true
   */
  selectable?: boolean;

  /**
   * Custom HTML element to render
   * @default 'p'
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * If true, text will be uppercase
   * @default false
   * @deprecated Use textTransform instead
   */
  uppercase?: boolean;

  /**
   * If true, text will be capitalized
   * @default false
   * @deprecated Use textTransform instead
   */
  capitalize?: boolean;

  /**
   * Typography weight
   */
  weight?: TypographyWeight;

  /**
   * Text alignment
   */
  textAlign?: TypographyAlign;

  /**
   * Letter spacing
   */
  letterSpacing?: TypographySpacing;

  /**
   * Line height as a multiplier
   */
  lineHeight?:
    | number
    | "normal"
    | "none"
    | "tight"
    | "snug"
    | "relaxed"
    | "loose";

  /**
   * Typography size (custom size system)
   */
  size?: TypographySize;

  /**
   * Text transform
   */
  textTransform?: TypographyTransform;

  /**
   * Gradient text configuration
   */
  gradient?: TypographyGradient;

  /**
   * Text shadow
   */
  textShadow?: "none" | "sm" | "md" | "lg" | "xl";

  /**
   * Hover effects
   */
  hoverEffect?:
    | "none"
    | "fade"
    | "glow"
    | "scale"
    | "color-shift"
    | "underline-grow";

  /**
   * Animation configuration
   */
  animation?: {
    type: "fade-in" | "slide-in" | "bounce" | "typewriter" | "glow-pulse";
    duration?: number;
    delay?: number;
    repeat?: boolean;
  };

  /**
   * If true, adds a reading guide/focus indicator
   */
  readingGuide?: boolean;

  /**
   * Responsive font sizing
   */
  responsive?: boolean;

  /**
   * Accessibility features
   */
  accessibility?: {
    screenReaderOnly?: boolean;
    announceChanges?: boolean;
    describedBy?: string;
  };

  /**
   * Text highlighting
   */
  highlight?: {
    enabled: boolean;
    color?: string;
    backgroundColor?: string;
    searchTerms?: string[];
  };

  /**
   * Typography contrast adjustments
   */
  contrast?: "low" | "normal" | "high" | "auto";

  /**
   * Loading state with shimmer effect
   */
  loading?: boolean;

  /**
   * Skeleton lines for loading state
   */
  skeletonLines?: number;
}
