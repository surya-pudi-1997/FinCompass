import { Chip as MUIChip, Tooltip } from "@mui/material";
import { forwardRef, ForwardedRef } from "react";
import { ChipProps } from "./Chip.types";

const statusToColorMap = {
  default: "default",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
} as const;

export const Chip = forwardRef(
  (
    {
      children,
      size = "medium",
      status = "default",
      shape = "rounded",
      outlined = false,
      leftIcon,
      rightIcon,
      uppercase = false,
      clickable = false,
      deletable = false,
      onDelete,
      tooltip,
      sx,
      ...props
    }: ChipProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const chip = (
      <MUIChip
        ref={ref}
        size={size}
        variant={outlined ? "outlined" : "filled"}
        color={statusToColorMap[status]}
        icon={leftIcon}
        deleteIcon={rightIcon}
        onDelete={deletable || onDelete ? onDelete : undefined}
        clickable={clickable}
        sx={{
          borderRadius: shape === "square" ? "4px" : undefined,
          textTransform: uppercase ? "uppercase" : "none",
          "& .MuiChip-label": {
            display: "flex",
            alignItems: "center",
            gap: "4px",
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </MUIChip>
    );

    if (tooltip) {
      return <Tooltip title={tooltip}>{chip}</Tooltip>;
    }

    return chip;
  }
);

Chip.displayName = "Chip";
