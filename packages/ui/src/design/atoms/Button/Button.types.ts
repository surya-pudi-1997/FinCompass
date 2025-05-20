import { ButtonProps as MUIButtonProps } from "@mui/material";
import { ReactElement } from "react";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "text" | "outlined" | "contained";

export interface ButtonProps
  extends Omit<MUIButtonProps, "size" | "variant" | "startIcon" | "endIcon"> {
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
   * If true, the button will be rounded
   * @default false
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
}
