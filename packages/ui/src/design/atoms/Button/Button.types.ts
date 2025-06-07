import { ButtonProps as MUIButtonProps } from "@mui/material";
import { ReactElement, ReactNode } from "react";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "text" | "outlined" | "contained";
export type ButtonColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";
export type ButtonShape = "rounded" | "square" | "circular";
export type ButtonAnimation = {
  type: "pulse" | "bounce" | "glow" | "fade" | "scale";
  duration?: number;
  delay?: number;
  repeat?: boolean;
};

export interface ButtonProps
  extends Omit<
    MUIButtonProps,
    "size" | "variant" | "startIcon" | "endIcon" | "color"
  > {
  /**
   * The size of the button
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * The variant of the button
   * @default 'contained'
   */
  variant?: ButtonVariant;

  /**
   * The color of the button
   * @default 'primary'
   */
  color?: ButtonColor;

  /**
   * Shape of the button
   * @default 'rounded'
   */
  shape?: ButtonShape;

  /**
   * If true, the button will be rounded (legacy prop, use shape instead)
   * @default false
   * @deprecated Use shape="rounded" instead
   */
  rounded?: boolean;

  /**
   * If true, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to be displayed at the start of the button
   */
  leftIcon?: ReactElement;

  /**
   * Icon to be displayed at the end of the button
   */
  rightIcon?: ReactElement;

  /**
   * If true, button will be rendered in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Custom loading text to display when loading
   */
  loadingText?: string;

  /**
   * If true, text will be uppercase
   * @default false
   */
  uppercase?: boolean;

  /**
   * Animation configuration
   */
  animation?: ButtonAnimation;

  /**
   * Custom gradient colors
   */
  gradient?: {
    start: string;
    end: string;
    direction?: "to right" | "to left" | "to bottom" | "to top";
  };

  /**
   * Enable glow effect
   * @default false
   */
  glow?: boolean;

  /**
   * Custom tooltip text
   */
  tooltip?: string;

  /**
   * Maximum width of the button
   */
  maxWidth?: string | number;

  /**
   * Enable focus ring
   * @default true
   */
  focusRing?: boolean;
}

export interface ButtonGroupProps {
  /**
   * The content of the button group
   */
  children: ReactNode;

  /**
   * The orientation of the button group
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";

  /**
   * The size of all buttons in the group
   */
  size?: ButtonSize;

  /**
   * The variant of all buttons in the group
   */
  variant?: ButtonVariant;

  /**
   * The color of all buttons in the group
   */
  color?: ButtonColor;

  /**
   * If true, buttons will be fully connected without spacing
   * @default false
   */
  attached?: boolean;

  /**
   * Spacing between buttons when not attached
   * @default 'sm'
   */
  spacing?: "none" | "xs" | "sm" | "md" | "lg";

  /**
   * If true, all buttons will take equal width
   * @default false
   */
  equalWidth?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * If true, the button group will be disabled
   * @default false
   */
  disabled?: boolean;
}
