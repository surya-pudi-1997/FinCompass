import { Button as MUIButton, CircularProgress } from "@mui/material";
import { forwardRef, ForwardedRef } from "react";
import { ButtonProps } from "./Button.types";

export const Button = forwardRef(
  (
    {
      children,
      size = "medium",
      variant = "contained",
      rounded = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText,
      uppercase = false,
      disabled,
      sx,
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const isDisabled = loading || disabled;

    return (
      <MUIButton
        ref={ref}
        size={size}
        variant={variant}
        fullWidth={fullWidth}
        disabled={isDisabled}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : leftIcon
        }
        endIcon={rightIcon}
        sx={{
          borderRadius: rounded ? "999px" : undefined,
          textTransform: uppercase ? "uppercase" : "none",
          ...sx,
        }}
        {...props}
      >
        {loading && loadingText ? loadingText : children}
      </MUIButton>
    );
  }
);

Button.displayName = "Button";
