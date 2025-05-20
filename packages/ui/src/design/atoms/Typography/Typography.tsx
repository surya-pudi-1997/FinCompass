import { Typography as MUITypography } from "@mui/material";
import { forwardRef, ForwardedRef } from "react";
import { TypographyProps } from "./Typography.types";

export const Typography = forwardRef(
  (
    {
      children,
      ellipsis = false,
      maxLines = 1,
      decoration = "none",
      selectable = true,
      as = "p",
      uppercase = false,
      capitalize = false,
      sx,
      color = "primary",
      ...props
    }: TypographyProps,
    ref: ForwardedRef<HTMLElement>
  ) => {
    return (
      <MUITypography
        ref={ref}
        component={as}
        sx={{
          textDecoration: decoration,
          userSelect: selectable ? "text" : "none",
          ...(ellipsis && {
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
          }),
          ...(uppercase && {
            textTransform: "uppercase",
          }),
          ...(capitalize && {
            textTransform: "capitalize",
          }),
          ...sx,
        }}
        color={`text.${color}`}
        {...props}
      >
        {children}
      </MUITypography>
    );
  }
);

Typography.displayName = "Typography";
