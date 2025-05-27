import { SelectProps as MuiSelectProps } from "@mui/material";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends Omit<MuiSelectProps, "error"> {
  options: SelectOption[];
  errorMessage?: string;
  isLoading?: boolean;
  error?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showBottomMargin?: boolean;
  /**
   * Whether the select takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  size?: "small" | "medium";
  variant?: "standard" | "outlined" | "filled";
}
