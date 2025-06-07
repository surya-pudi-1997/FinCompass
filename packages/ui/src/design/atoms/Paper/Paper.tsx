import { Paper as MUIPaper, useTheme } from "@mui/material";
import { ForwardedRef, forwardRef, useMemo } from "react";
import { PaperProps, PaperSpacing, PaperRounding } from "./Paper.types";

export const Paper = forwardRef(
  (
    {
      children,
      className,
      sx,
      variant = "default",
      elevation = 1,
      padding = "none",
      margin = "none",
      rounded = "md",
      square = false,
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      width,
      height,
      hover = false,
      interactive = false,
      cursor = "default",
      transitionDuration = "0.2s",
      backgroundColor,
      borderColor,
      borderWidth,
      overflow,
      ariaLabel,
      ariaDescribedBy,
      role,
      tabIndex,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...rest
    }: PaperProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const theme = useTheme();

    const spacingMap: Record<PaperSpacing, number> = {
      none: 0,
      xs: 0.5,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4,
      xxl: 6,
    };

    const roundingMap: Record<PaperRounding, string | number> = {
      none: 0,
      xs: theme.shape.borderRadius * 0.5,
      sm: theme.shape.borderRadius * 0.75,
      md: theme.shape.borderRadius,
      lg: theme.shape.borderRadius * 1.5,
      xl: theme.shape.borderRadius * 2,
      full: "50%",
    };

    const getVariantStyles = () => {
      const baseStyles = {
        padding: theme.spacing(spacingMap[padding]),
        margin: theme.spacing(spacingMap[margin]),
        borderRadius: square ? 0 : roundingMap[rounded],
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
        width,
        height,
        overflow,
        cursor: interactive ? "pointer" : cursor,
        transition:
          hover || interactive
            ? `all ${transitionDuration} ease-in-out`
            : undefined,
      };

      switch (variant) {
        case "outlined":
          return {
            ...baseStyles,
            elevation: 0,
            border: `${borderWidth || 1}px solid ${
              borderColor || theme.palette.divider
            }`,
            backgroundColor: backgroundColor || theme.palette.background.paper,
          };

        case "elevation":
          return {
            ...baseStyles,
            elevation: elevation,
            backgroundColor: backgroundColor || theme.palette.background.paper,
          };

        case "card":
          return {
            ...baseStyles,
            elevation: hover ? Math.min(elevation + 2, 24) : elevation,
            borderRadius: square ? 0 : theme.shape.borderRadius,
            backgroundColor: backgroundColor || theme.palette.background.paper,
            "&:hover": hover
              ? {
                  elevation: Math.min(elevation + 4, 24),
                  transform: "translateY(-2px)",
                }
              : undefined,
          };

        case "sidebar":
          return {
            ...baseStyles,
            elevation: 2,
            backgroundColor:
              backgroundColor || theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
            borderRadius: 0,
          };

        case "dashboard":
          return {
            ...baseStyles,
            elevation: 1,
            backgroundColor: backgroundColor || theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: square ? 0 : theme.shape.borderRadius,
          };

        case "modal":
          return {
            ...baseStyles,
            elevation: 24,
            backgroundColor: backgroundColor || theme.palette.background.paper,
            borderRadius: square ? 0 : theme.shape.borderRadius * 2,
          };

        case "tooltip":
          return {
            ...baseStyles,
            elevation: 8,
            backgroundColor: backgroundColor || theme.palette.grey[800],
            color: theme.palette.common.white,
            borderRadius: square ? 0 : theme.shape.borderRadius * 0.5,
          };

        default:
          return {
            ...baseStyles,
            elevation: elevation,
            backgroundColor: backgroundColor || theme.palette.background.paper,
          };
      }
    };

    const variantStyles = getVariantStyles();
    const paperElevation =
      variant === "outlined" ? 0 : variantStyles.elevation || elevation;

    const combinedSx = useMemo(() => {
      const hoverStyles =
        hover && variant !== "card"
          ? {
              "&:hover": {
                elevation: Math.min((paperElevation as number) + 2, 24),
                transform: "translateY(-1px)",
              },
            }
          : {};

      const interactiveStyles = interactive
        ? {
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "&:focus": {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: "2px",
            },
          }
        : {};

      return {
        ...variantStyles,
        ...hoverStyles,
        ...interactiveStyles,
        ...sx,
      };
    }, [variantStyles, hover, interactive, theme, sx, paperElevation, variant]);

    return (
      <MUIPaper
        ref={ref}
        className={className}
        elevation={paperElevation}
        square={square}
        sx={combinedSx}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex={interactive ? tabIndex || 0 : tabIndex}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        {...rest}
      >
        {children}
      </MUIPaper>
    );
  }
);

Paper.displayName = "Paper";
