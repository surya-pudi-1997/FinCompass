import React from "react";
import {
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import { SelectProps } from "./select.types";

export const Select: React.FC<SelectProps> = ({
  options,
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
  label,
  sx,
  ...props
}) => {
  // Calculate whether to show margin based on error state and showBottomMargin prop
  const hasError = error || Boolean(errorMessage);
  const showMargin = showBottomMargin && !hasError && !helperText;
  const labelId = `select-label-${label?.toString().toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <FormControl
      variant={variant}
      size={size}
      error={hasError}
      fullWidth={fullWidth}
      sx={{
        ...sx,
        marginBottom: showMargin ? "1.5em" : undefined,
      }}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect
        {...props}
        labelId={labelId}
        label={label}
        startAdornment={
          startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : null
        }
        endAdornment={
          <>
            {isLoading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            )}
            {endIcon && (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            )}
          </>
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(errorMessage || helperText) && (
        <FormHelperText>{errorMessage || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default Select;
