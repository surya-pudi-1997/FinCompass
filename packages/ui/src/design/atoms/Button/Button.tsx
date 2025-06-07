import {
  Button as MUIButton,
  Tooltip,
  CircularProgress,
  Box,
  ButtonGroup as MUIButtonGroup,
} from "@mui/material";
import { forwardRef, ForwardedRef, useMemo, cloneElement } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import { ButtonProps, ButtonGroupProps } from "./Button.types";

const colorToMUIColorMap = {
  inherit: "inherit",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  info: "info",
  warning: "warning",
} as const;

export const Button = forwardRef(
  (
    {
      children,
      size = "medium",
      variant = "contained",
      color = "primary",
      shape = "rounded",
      rounded = false, // legacy prop
      fullWidth = false,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText,
      uppercase = false,
      animation,
      gradient,
      glow = false,
      tooltip,
      maxWidth,
      focusRing = true,
      disabled,
      sx,
      onClick,
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    // Handle legacy rounded prop
    const finalShape = rounded ? "rounded" : shape;

    const getSizeStyles = () => {
      switch (size) {
        case "small":
          return {
            minHeight: "32px",
            fontSize: "0.875rem",
            padding: "6px 16px",
          };
        case "medium":
          return {
            minHeight: "40px",
            fontSize: "0.9375rem",
            padding: "8px 22px",
          };
        case "large":
          return {
            minHeight: "48px",
            fontSize: "1rem",
            padding: "10px 24px",
          };
        default:
          return {};
      }
    };

    const getShapeStyles = () => {
      switch (finalShape) {
        case "rounded":
          return { borderRadius: "8px" };
        case "square":
          return { borderRadius: "0px" };
        case "circular":
          return { borderRadius: "50%", minWidth: "40px" };
        default:
          return { borderRadius: "6px" };
      }
    };

    const getAnimationStyles = () => {
      if (!animation) return {};

      const { type, duration = 300, delay = 0, repeat = false } = animation;
      const animationDuration = `${duration}ms`;
      const animationDelay = delay > 0 ? `${delay}ms` : "0ms";
      const animationIterationCount = repeat ? "infinite" : "1";

      const keyframes = {
        pulse: {
          "@keyframes buttonPulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.05)" },
          },
          animation: `buttonPulse ${animationDuration} ${animationDelay} ${animationIterationCount} ease-in-out`,
        },
        bounce: {
          "@keyframes buttonBounce": {
            "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
            "40%": { transform: "translateY(-10px)" },
            "60%": { transform: "translateY(-5px)" },
          },
          animation: `buttonBounce ${animationDuration} ${animationDelay} ${animationIterationCount} ease`,
        },
        glow: {
          "@keyframes buttonGlow": {
            "0%, 100%": { boxShadow: "0 0 5px rgba(31, 228, 176, 0.3)" },
            "50%": { boxShadow: "0 0 20px rgba(31, 228, 176, 0.8)" },
          },
          animation: `buttonGlow ${animationDuration} ${animationDelay} ${animationIterationCount} ease-in-out`,
        },
        fade: {
          "@keyframes buttonFade": {
            "0%": { opacity: 0.7 },
            "100%": { opacity: 1 },
          },
          animation: `buttonFade ${animationDuration} ${animationDelay} ${animationIterationCount} ease-in-out`,
        },
        scale: {
          "@keyframes buttonScale": {
            "0%": { transform: "scale(0.95)" },
            "100%": { transform: "scale(1)" },
          },
          animation: `buttonScale ${animationDuration} ${animationDelay} ${animationIterationCount} ease-out`,
        },
      };

      return keyframes[type] || {};
    };

    const getGradientStyles = () => {
      if (!gradient) return {};

      return {
        background: `linear-gradient(${gradient.direction || "to right"}, ${gradient.start}, ${gradient.end})`,
        color: "white",
        "&:hover": {
          background: `linear-gradient(${gradient.direction || "to right"}, ${gradient.start}, ${gradient.end})`,
          filter: "brightness(1.1)",
        },
      };
    };

    const getGlowStyles = () => {
      if (!glow) return {};

      return {
        boxShadow: "0 0 10px rgba(31, 228, 176, 0.4)",
        "&:hover": {
          boxShadow: "0 0 20px rgba(31, 228, 176, 0.6)",
        },
      };
    };
    const getFocusRingStyles = () => {
      if (!focusRing) return { "&:focus": { outline: "none" } };

      return {
        "&:focus": {
          outline: "2px solid rgba(31, 228, 176, 0.5)",
          outlineOffset: "2px",
        },
      };
    };
    const buttonStyles = useMemo(() => {
      const styles = {
        ...getSizeStyles(),
        ...getShapeStyles(),
        ...getAnimationStyles(),
        ...getGradientStyles(),
        ...getGlowStyles(),
        ...getFocusRingStyles(),
        textTransform: uppercase ? "uppercase" : "none",
        ...(maxWidth && { maxWidth }),
        "&.Mui-disabled": {
          opacity: 0.6,
          cursor: "not-allowed",
        },
      };

      // Filter out undefined values and merge with sx
      const filteredStyles = Object.entries(styles).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      return { ...filteredStyles, ...sx };
    }, [
      size,
      finalShape,
      animation,
      gradient,
      glow,
      focusRing,
      uppercase,
      maxWidth,
      sx,
    ]);

    const renderIcon = (
      icon: React.ReactElement,
      position: "start" | "end"
    ) => {
      if (!icon) return null;

      return cloneElement(icon, {
        style: {
          fontSize:
            size === "small" ? "16px" : size === "large" ? "20px" : "18px",
          ...icon.props.style,
        },
      });
    };

    const renderContent = () => {
      if (loading) {
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress
              size={size === "small" ? 16 : size === "large" ? 20 : 18}
              color="inherit"
            />
            {loadingText || children}
          </Box>
        );
      }

      return (
        <Box
          display="flex"
          alignItems="center"
          gap={leftIcon && rightIcon ? 1 : 0.5}
        >
          {leftIcon && renderIcon(leftIcon, "start")}
          <span>{children}</span>
          {rightIcon && renderIcon(rightIcon, "end")}
        </Box>
      );
    };

    const buttonElement = (
      <MUIButton
        ref={ref}
        size={size}
        variant={variant}
        color={colorToMUIColorMap[color]}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        sx={buttonStyles}
        onClick={onClick}
        {...props}
      >
        {renderContent()}
      </MUIButton>
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow>
          {buttonElement}
        </Tooltip>
      );
    }

    return buttonElement;
  }
);

Button.displayName = "Button";

export const ButtonGroup = forwardRef(
  (
    {
      children,
      orientation = "horizontal",
      size,
      variant,
      color,
      attached = false,
      spacing = "sm",
      equalWidth = false,
      className,
      disabled = false,
      ...props
    }: ButtonGroupProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const getSpacingValue = () => {
      const spacingMap = {
        none: 0,
        xs: 0.5,
        sm: 1,
        md: 1.5,
        lg: 2,
      };
      return spacingMap[spacing] || 1;
    };

    if (attached) {
      return (
        <MUIButtonGroup
          ref={ref}
          orientation={orientation}
          size={size}
          variant={variant}
          color={color && colorToMUIColorMap[color]}
          disabled={disabled}
          className={className}
          sx={{
            "& .MuiButton-root": {
              flex: equalWidth ? 1 : "auto",
            },
          }}
          {...props}
        >
          {children}
        </MUIButtonGroup>
      );
    }

    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          display: "flex",
          flexDirection: orientation === "vertical" ? "column" : "row",
          gap: getSpacingValue(),
          "& .MuiButton-root": {
            flex: equalWidth ? 1 : "auto",
          },
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";
