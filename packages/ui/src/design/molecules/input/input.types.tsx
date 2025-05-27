import { TextFieldProps } from "@mui/material";
import { ReactNode } from "react";

export interface InputProps extends Omit<TextFieldProps, "variant"> {
  /**
   * The variant of the input
   * @default "outlined"
   */
  variant?: "outlined" | "filled" | "standard";

  /**
   * The size of the input
   * @default "medium"
   */
  size?: "small" | "medium";

  /**
   * Whether the input takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Help text to display below the input
   */
  helperText?: string;

  /**
   * Whether the input is in loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Icon to be displayed at the start of the input
   */
  startIcon?: ReactNode;

  /**
   * Icon to be displayed at the end of the input
   */
  endIcon?: ReactNode;

  /**
   * Whether to show bottom margin that matches helper text height
   * @default false
   */
  showBottomMargin?: boolean;
}
