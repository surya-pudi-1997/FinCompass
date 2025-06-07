import { Typography as MUITypography, Skeleton, Box } from "@mui/material";
import { forwardRef, ForwardedRef, useMemo, useState, useEffect } from "react";
import {
  TypographyProps,
  TypographyWeight,
  TypographyAlign,
  TypographySpacing,
  TypographySize,
} from "./Typography.types";

const fontWeightMap: Record<TypographyWeight, number> = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

const textAlignMap: Record<TypographyAlign, string> = {
  left: "left",
  center: "center",
  right: "right",
  justify: "justify",
  start: "start",
  end: "end",
};

const letterSpacingMap: Record<TypographySpacing, string> = {
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

const sizeMap: Record<
  TypographySize,
  { fontSize: string; lineHeight: string }
> = {
  xs: { fontSize: "0.75rem", lineHeight: "1rem" },
  sm: { fontSize: "0.875rem", lineHeight: "1.25rem" },
  base: { fontSize: "1rem", lineHeight: "1.5rem" },
  lg: { fontSize: "1.125rem", lineHeight: "1.75rem" },
  xl: { fontSize: "1.25rem", lineHeight: "1.75rem" },
  "2xl": { fontSize: "1.5rem", lineHeight: "2rem" },
  "3xl": { fontSize: "1.875rem", lineHeight: "2.25rem" },
  "4xl": { fontSize: "2.25rem", lineHeight: "2.5rem" },
  "5xl": { fontSize: "3rem", lineHeight: "1" },
  "6xl": { fontSize: "3.75rem", lineHeight: "1" },
};

const textShadowMap = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  lg: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)",
  xl: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
};

const lineHeightMap = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

const getGradientStyle = (gradient: TypographyProps["gradient"]) => {
  if (!gradient) return {};

  const directionMap = {
    "to-r": "to right",
    "to-l": "to left",
    "to-t": "to top",
    "to-b": "to bottom",
    "to-br": "to bottom right",
    "to-bl": "to bottom left",
    "to-tr": "to top right",
    "to-tl": "to top left",
  };

  const direction = directionMap[gradient.direction || "to-r"];

  return {
    background: `linear-gradient(${direction}, ${gradient.from}, ${gradient.to})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };
};

const getHoverEffectStyle = (hoverEffect: TypographyProps["hoverEffect"]) => {
  switch (hoverEffect) {
    case "fade":
      return {
        transition: "opacity 0.2s ease",
        "&:hover": { opacity: 0.7 },
      };
    case "glow":
      return {
        transition: "text-shadow 0.2s ease",
        "&:hover": { textShadow: "0 0 10px currentColor" },
      };
    case "scale":
      return {
        transition: "transform 0.2s ease",
        "&:hover": { transform: "scale(1.05)" },
      };
    case "color-shift":
      return {
        transition: "color 0.2s ease",
        "&:hover": { color: "primary.main" },
      };
    case "underline-grow":
      return {
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 0,
          height: "2px",
          backgroundColor: "currentColor",
          transition: "width 0.3s ease",
        },
        "&:hover::after": {
          width: "100%",
        },
      };
    default:
      return {};
  }
};

const getAnimationStyle = (animation: TypographyProps["animation"]) => {
  if (!animation) return {};

  const { type, duration = 1, delay = 0, repeat = false } = animation;

  const animationMap = {
    "fade-in": `fadeIn ${duration}s ease ${delay}s ${repeat ? "infinite" : "1"} both`,
    "slide-in": `slideIn ${duration}s ease ${delay}s ${repeat ? "infinite" : "1"} both`,
    bounce: `bounce ${duration}s ease ${delay}s ${repeat ? "infinite" : "1"} both`,
    typewriter: `typewriter ${duration}s steps(40) ${delay}s ${repeat ? "infinite" : "1"} both`,
    "glow-pulse": `glowPulse ${duration}s ease-in-out ${delay}s ${repeat ? "infinite" : "1"} both`,
  };

  return {
    animation: animationMap[type],
  };
};

const highlightText = (
  text: string,
  searchTerms: string[] = [],
  highlightColor = "#ffeb3b"
) => {
  if (!searchTerms.length) return text;

  let highlightedText = text;
  searchTerms.forEach((term) => {
    const regex = new RegExp(`(${term})`, "gi");
    highlightedText = highlightedText.replace(
      regex,
      `<mark style="background-color: ${highlightColor}; padding: 0 2px;">$1</mark>`
    );
  });

  return highlightedText;
};

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
      weight,
      textAlign,
      letterSpacing,
      lineHeight,
      size,
      textTransform,
      gradient,
      textShadow,
      hoverEffect,
      animation,
      readingGuide = false,
      responsive = false,
      accessibility,
      highlight,
      contrast = "normal",
      loading = false,
      skeletonLines = 1,
      sx,
      color = "primary",
      ...props
    }: TypographyProps,
    ref: ForwardedRef<HTMLElement>
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (animation) {
        setIsAnimating(true);
        const timer = setTimeout(
          () => {
            if (!animation.repeat) setIsAnimating(false);
          },
          (animation.duration || 1) * 1000 + (animation.delay || 0) * 1000
        );

        return () => clearTimeout(timer);
      }
    }, [animation]);

    const processedChildren = useMemo(() => {
      if (typeof children !== "string") return children;

      if (highlight?.enabled) {
        return (
          <span
            dangerouslySetInnerHTML={{
              __html: highlightText(
                children,
                highlight.searchTerms,
                highlight.backgroundColor
              ),
            }}
          />
        );
      }

      return children;
    }, [children, highlight]);

    const computedStyles = useMemo(() => {
      let styles: any = {
        textDecoration: decoration,
        userSelect: selectable ? "text" : "none",
        ...sx,
      };

      // Handle ellipsis
      if (ellipsis) {
        styles = {
          ...styles,
          display: "-webkit-box",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: maxLines,
        };
      }

      // Handle legacy text transform
      if (uppercase || textTransform === "uppercase") {
        styles.textTransform = "uppercase";
      } else if (capitalize || textTransform === "capitalize") {
        styles.textTransform = "capitalize";
      } else if (textTransform) {
        styles.textTransform = textTransform;
      }

      // Handle font weight
      if (weight) {
        styles.fontWeight = fontWeightMap[weight];
      }

      // Handle text alignment
      if (textAlign) {
        styles.textAlign = textAlignMap[textAlign];
      }

      // Handle letter spacing
      if (letterSpacing) {
        styles.letterSpacing = letterSpacingMap[letterSpacing];
      }

      // Handle line height
      if (lineHeight) {
        if (typeof lineHeight === "number") {
          styles.lineHeight = lineHeight;
        } else if (lineHeight in lineHeightMap) {
          styles.lineHeight =
            lineHeightMap[lineHeight as keyof typeof lineHeightMap];
        } else {
          styles.lineHeight = lineHeight;
        }
      }

      // Handle custom size
      if (size) {
        const sizeConfig = sizeMap[size];
        styles.fontSize = sizeConfig.fontSize;
        if (!lineHeight) {
          styles.lineHeight = sizeConfig.lineHeight;
        }
      }

      // Handle gradient
      if (gradient) {
        styles = { ...styles, ...getGradientStyle(gradient) };
      }

      // Handle text shadow
      if (textShadow) {
        styles.textShadow = textShadowMap[textShadow];
      }

      // Handle hover effects
      if (hoverEffect) {
        styles = { ...styles, ...getHoverEffectStyle(hoverEffect) };
      }

      // Handle animations
      if (animation && isAnimating) {
        styles = { ...styles, ...getAnimationStyle(animation) };
      }

      // Handle reading guide
      if (readingGuide) {
        styles = {
          ...styles,
          position: "relative",
          "&:focus": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "2px",
          },
        };
      }

      // Handle responsive sizing
      if (responsive) {
        styles = {
          ...styles,
          fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)",
        };
      }

      // Handle contrast adjustments
      const contrastMap = {
        low: 0.7,
        normal: 1,
        high: 1.2,
        auto: "auto",
      };

      if (contrast !== "normal") {
        styles.opacity = contrastMap[contrast];
      }

      // Handle accessibility
      if (accessibility?.screenReaderOnly) {
        styles = {
          ...styles,
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        };
      }

      return styles;
    }, [
      decoration,
      selectable,
      sx,
      ellipsis,
      maxLines,
      uppercase,
      capitalize,
      textTransform,
      weight,
      textAlign,
      letterSpacing,
      lineHeight,
      size,
      gradient,
      textShadow,
      hoverEffect,
      animation,
      isAnimating,
      readingGuide,
      responsive,
      contrast,
      accessibility,
    ]);

    // Handle loading state
    if (loading) {
      return (
        <Box>
          {Array.from({ length: skeletonLines }, (_, index) => (
            <Skeleton
              key={index}
              variant="text"
              width={index === skeletonLines - 1 ? "60%" : "100%"}
              sx={{ fontSize: size ? sizeMap[size].fontSize : "1rem" }}
            />
          ))}
        </Box>
      );
    }
    return (
      <>
        <MUITypography
          ref={ref}
          component={as}
          sx={computedStyles}
          color={gradient ? undefined : `text.${color}`}
          role={accessibility?.announceChanges ? "status" : undefined}
          aria-describedby={accessibility?.describedBy}
          tabIndex={readingGuide ? 0 : undefined}
          {...props}
        >
          {processedChildren}
        </MUITypography>
        {/* Global animation keyframes */}
        {animation && (
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes slideIn {
                from { transform: translateY(-10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              
              @keyframes bounce {
                0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
                40%, 43% { transform: translate3d(0, -30px, 0); }
                70% { transform: translate3d(0, -15px, 0); }
                90% { transform: translate3d(0, -4px, 0); }
              }
              
              @keyframes typewriter {
                from { width: 0; }
                to { width: 100%; }
              }
              
              @keyframes glowPulse {
                0%, 100% { text-shadow: 0 0 5px currentColor; }
                50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
              }
            `}
          </style>
        )}
      </>
    );
  }
);

Typography.displayName = "Typography";

Typography.displayName = "Typography";
