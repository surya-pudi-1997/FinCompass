import React from "react";
import { TextField, CircularProgress, InputAdornment } from "@mui/material";
import { InputProps } from "./input.types";

export const Input: React.FC<InputProps> = ({
  variant = "outlined",
  size = "medium",
  errorMessage,
  isLoading,
  error,
  helperText,
  startIcon,
  endIcon,
  showBottomMargin = false,
  fullWidth = false,
  InputProps: customInputProps,
  sx,
  ...props
}) => {
  // Calculate whether to show margin based on error state and showBottomMargin prop
  const hasError = error || Boolean(errorMessage);
  const showMargin = showBottomMargin && !hasError && !helperText;

  return (
    <TextField
      {...props}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      error={hasError}
      helperText={errorMessage || helperText}
      sx={{
        ...sx,
        // Add margin-bottom that matches helper text height when enabled
        marginBottom: showMargin ? "1.5em" : undefined,
      }}
      InputProps={{
        ...customInputProps,
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : (
          customInputProps?.startAdornment
        ),
        endAdornment: (
          <>
            {isLoading && <CircularProgress size={20} />}
            {endIcon && (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            )}
            {customInputProps?.endAdornment}
          </>
        ),
      }}
    />
  );
};

export default Input;
