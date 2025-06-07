import { Box as MUIBox, useTheme } from "@mui/material";
import { ForwardedRef, forwardRef, useMemo } from "react";
import { BoxProps, BoxSpacing, BoxShadow, BoxRounding } from "./Box.types";

export const Box = forwardRef(
  (
    {
      as = "div",
      children,
      className,
      sx,
      variant,
      padding = "none",
      margin = "none",
      shadow = "none",
      rounded = "none",
      border,
      gradient,
      hover = false,
      cursor = "default",
      transition,
      overflow,
      display,
      position,
      zIndex,
      flexDirection,
      flexWrap,
      justifyContent,
      alignItems,
      alignContent,
      gap,
      gridTemplateColumns,
      gridTemplateRows,
      gridColumn,
      gridRow,
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      animation,
      responsive = false,
      breakpoints,
      role,
      ariaLabel,
      ariaDescribedBy,
      focusable = false,
      tabIndex,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...otherProps
    }: BoxProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const theme = useTheme();

    const getSpacingValue = (spacing: BoxSpacing): number => {
      const spacingMap = {
        none: 0,
        xs: 0.5,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 6,
      };
      return spacingMap[spacing];
    };

    const getShadowValue = (shadow: BoxShadow): string => {
      const shadowMap = {
        none: "none",
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      };
      return shadowMap[shadow];
    };

    const getRoundingValue = (rounding: BoxRounding): string | number => {
      const roundingMap = {
        none: 0,
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 12,
        full: "50%",
      };
      return roundingMap[rounding];
    };

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
        case "card":
          return {
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
            padding: theme.spacing(2),
          };
        case "sidebar":
          return {
            height: "100vh",
            width: "250px",
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            overflow: "auto",
          };
        case "navbar":
          return {
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            padding: theme.spacing(1, 2),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          };
        case "footer":
          return {
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
            padding: theme.spacing(2),
            marginTop: "auto",
          };
        case "container":
          return {
            maxWidth: "1200px",
            margin: "0 auto",
            padding: theme.spacing(0, 2),
          };
        case "grid-item":
          return {
            padding: theme.spacing(1),
          };
        case "scroll-container":
          return {
            overflow: "auto",
            maxHeight: "400px",
          };
        default:
          return {};
      }
    };

    const generateResponsiveStyles = useMemo(() => {
      if (!responsive || !breakpoints) return {};

      const responsiveStyles: any = {};

      Object.entries(breakpoints).forEach(([breakpoint, styles]) => {
        const mediaQuery = theme.breakpoints.up(breakpoint as any);
        responsiveStyles[mediaQuery] = {
          ...styles,
          padding: styles.padding
            ? theme.spacing(getSpacingValue(styles.padding))
            : undefined,
          margin: styles.margin
            ? theme.spacing(getSpacingValue(styles.margin))
            : undefined,
          boxShadow: styles.shadow ? getShadowValue(styles.shadow) : undefined,
          borderRadius: styles.rounded
            ? getRoundingValue(styles.rounded)
            : undefined,
        };
      });

      return responsiveStyles;
    }, [responsive, breakpoints, theme]);

    const computedStyles: React.CSSProperties = useMemo(() => {
      const styles: React.CSSProperties = {
        ...getVariantStyles(variant),
      };

      // Spacing
      if (padding !== "none") {
        styles.padding = theme.spacing(getSpacingValue(padding));
      }
      if (margin !== "none") {
        styles.margin = theme.spacing(getSpacingValue(margin));
      }

      // Shadow
      if (shadow !== "none") {
        styles.boxShadow = getShadowValue(shadow);
      }

      // Border radius
      if (rounded !== "none") {
        styles.borderRadius = getRoundingValue(rounded);
      }

      // Border
      if (border && border.style !== "none") {
        styles.border = `${border.width || 1}px ${border.style} ${border.color || theme.palette.divider}`;
      }

      // Gradient
      if (gradient) {
        styles.background = `linear-gradient(${gradient.direction || "to right"}, ${gradient.start}, ${gradient.end})`;
      }

      // Cursor
      styles.cursor = cursor;

      // Transition
      if (transition) {
        styles.transition = `${transition.property || "all"} ${transition.duration || "0.2s"} ${transition.easing || "ease-in-out"}`;
      }

      // Layout properties
      if (display) styles.display = display;
      if (position) styles.position = position;
      if (zIndex !== undefined) styles.zIndex = zIndex;
      if (overflow) styles.overflow = overflow;

      // Flex properties
      if (flexDirection) styles.flexDirection = flexDirection;
      if (flexWrap) styles.flexWrap = flexWrap;
      if (justifyContent) styles.justifyContent = justifyContent;
      if (alignItems) styles.alignItems = alignItems;
      if (alignContent) styles.alignContent = alignContent;
      if (gap !== undefined) {
        styles.gap =
          typeof gap === "number" ? gap : theme.spacing(getSpacingValue(gap));
      }

      // Grid properties
      if (gridTemplateColumns) styles.gridTemplateColumns = gridTemplateColumns;
      if (gridTemplateRows) styles.gridTemplateRows = gridTemplateRows;
      if (gridColumn) styles.gridColumn = gridColumn;
      if (gridRow) styles.gridRow = gridRow;

      // Size constraints
      if (maxWidth) styles.maxWidth = maxWidth;
      if (maxHeight) styles.maxHeight = maxHeight;
      if (minWidth) styles.minWidth = minWidth;
      if (minHeight) styles.minHeight = minHeight;

      // Animation
      if (animation) {
        styles.animation = `${animation.name || ""} ${animation.duration || "1s"} ${animation.timing || "ease"} ${animation.delay || "0s"} ${animation.iteration || "1"} ${animation.direction || "normal"} ${animation.fillMode || "none"}`;
      }

      // Hover effects
      if (hover) {
        styles.transition = styles.transition || "all 0.2s ease-in-out";
      }

      // Focus styles
      if (focusable) {
        styles.outline = "none";
      }

      return styles;
    }, [
      variant,
      padding,
      margin,
      shadow,
      rounded,
      border,
      gradient,
      cursor,
      transition,
      display,
      position,
      zIndex,
      overflow,
      flexDirection,
      flexWrap,
      justifyContent,
      alignItems,
      alignContent,
      gap,
      gridTemplateColumns,
      gridTemplateRows,
      gridColumn,
      gridRow,
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      animation,
      hover,
      focusable,
      theme,
    ]);

    const hoverStyles = hover
      ? {
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow:
              shadow !== "none" ? getShadowValue("lg") : theme.shadows[4],
          },
        }
      : {};

    const focusStyles = focusable
      ? {
          "&:focus": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: "2px",
          },
        }
      : {};

    return (
      <MUIBox
        ref={ref}
        component={as}
        className={className}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex={
          focusable ? (tabIndex !== undefined ? tabIndex : 0) : tabIndex
        }
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        sx={{
          ...computedStyles,
          ...hoverStyles,
          ...focusStyles,
          ...generateResponsiveStyles,
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
