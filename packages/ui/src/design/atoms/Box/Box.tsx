import { Box as MUIBox } from "@mui/material";
import { ForwardedRef, forwardRef } from "react";
import { BoxProps } from "./Box.types";

export const Box = forwardRef(
  (
    { as = "div", children, className, sx, variant, ...otherProps }: BoxProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const getVariantStyles = (variant: string = ""): React.CSSProperties => {
      switch (variant) {
        case "flex-fixed":
          return {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          };
        case "flex-grow":
          return {
            display: "flex",
            flex: "1 1 auto",
          };
        case "vertical-centered":
          return {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          };
        case "horizontal-centered":
          return {
            display: "flex",
            justifyContent: "center",
          };
        case "vertical-centered-full-width":
          return {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          };
        case "horizontal-centered-full-width":
          return {
            display: "flex",
            justifyContent: "center",
            width: "100%",
          };
        default:
          return {};
      }
    };
    return (
      <MUIBox
        ref={ref}
        component={as}
        className={className}
        bgcolor="background.default"
        sx={{
          ...getVariantStyles(variant),
          ...sx,
        }}
        {...otherProps}
      >
        {children}
      </MUIBox>
    );
  }
);

Box.displayName = "Box";
