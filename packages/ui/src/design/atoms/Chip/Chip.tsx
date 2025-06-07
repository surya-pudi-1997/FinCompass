import {
  Chip as MUIChip,
  Tooltip,
  CircularProgress,
  Badge,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { forwardRef, ForwardedRef, useState, useMemo } from "react";
import { ChipProps, ChipGroupProps } from "./Chip.types";

const statusToColorMap = {
  default: "default",
  primary: "primary",
  secondary: "secondary",
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
      variant = "filled",
      shape = "rounded",
      leftIcon,
      rightIcon,
      avatar,
      uppercase = false,
      clickable = false,
      deletable = false,
      onDelete,
      tooltip,
      loading = false,
      loadingText,
      glow = false,
      pulse = false,
      bounce = false,
      gradient,
      badge,
      selectable = false,
      selected = false,
      onSelectionChange,
      maxWidth,
      truncate = false,
      closeIcon,
      draggable = false,
      onDragStart,
      onDragEnd,
      grouped = false,
      group,
      priority,
      validation,
      ariaLabel,
      ariaDescribedBy,
      sx,
      onClick,
      ...props
    }: ChipProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [internalSelected, setInternalSelected] = useState(selected);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (selectable) {
        const newSelected = !internalSelected;
        setInternalSelected(newSelected);
        onSelectionChange?.(newSelected);
      }
      onClick?.(event);
    };

    const getSizeStyles = () => {
      switch (size) {
        case "small":
          return { height: "24px", fontSize: "0.75rem" };
        case "medium":
          return { height: "32px", fontSize: "0.875rem" };
        case "large":
          return { height: "40px", fontSize: "1rem", padding: "0 16px" };
        default:
          return {};
      }
    };

    const getVariantStyles = () => {
      const baseStyles = getSizeStyles();

      switch (variant) {
        case "filled":
          return baseStyles;
        case "outlined":
          return { ...baseStyles, backgroundColor: "transparent" };
        case "soft":
          return {
            ...baseStyles,
            backgroundColor: "rgba(var(--chip-color), 0.1)",
            color: `var(--chip-color)`,
            border: "none",
          };
        case "ghost":
          return {
            ...baseStyles,
            backgroundColor: "transparent",
            border: "1px solid transparent",
            "&:hover": {
              backgroundColor: "rgba(var(--chip-color), 0.05)",
            },
          };
        case "gradient":
          return {
            ...baseStyles,
            background: gradient
              ? `linear-gradient(${gradient.direction || "to right"}, ${gradient.start}, ${gradient.end})`
              : "linear-gradient(to right, #667eea, #764ba2)",
            color: "white",
            border: "none",
          };
        default:
          return baseStyles;
      }
    };

    const getShapeStyles = () => {
      switch (shape) {
        case "square":
          return { borderRadius: "4px" };
        case "circular":
          return { borderRadius: "50%" };
        case "rounded":
        default:
          return {};
      }
    };

    const getAnimationStyles = () => {
      const animations: any = {};

      if (pulse) {
        animations["@keyframes pulse"] = {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        };
        animations.animation = "pulse 2s infinite";
      }

      if (bounce) {
        animations["@keyframes bounce"] = {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-4px)" },
          "60%": { transform: "translateY(-2px)" },
        };
        animations["&:hover"] = {
          animation: "bounce 0.6s",
        };
      }

      if (glow) {
        animations.boxShadow = `0 0 10px rgba(var(--chip-color), 0.5)`;
      }

      return animations;
    };

    const chipContent = useMemo(() => {
      if (loading) {
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} color="inherit" />
            {loadingText || "Loading..."}
          </Box>
        );
      }

      const content =
        truncate && maxWidth ? (
          <Box
            sx={{
              maxWidth,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {children}
          </Box>
        ) : (
          children
        );

      return content;
    }, [loading, loadingText, truncate, maxWidth, children]);
    const chipElement = (
      <MUIChip
        ref={ref}
        size={size === "large" ? "medium" : size}
        variant={variant === "outlined" ? "outlined" : "filled"}
        color={statusToColorMap[status] as any}
        icon={leftIcon}
        avatar={avatar}
        deleteIcon={deletable ? closeIcon || rightIcon : undefined}
        onDelete={deletable ? onDelete : undefined}
        clickable={clickable || selectable}
        onClick={handleClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        label={chipContent}
        sx={{
          ...getVariantStyles(),
          ...getShapeStyles(),
          ...getAnimationStyles(),
          textTransform: uppercase ? "uppercase" : "none",
          maxWidth: maxWidth || "none",
          opacity: selectable && internalSelected ? 1 : undefined,
          backgroundColor:
            selectable && internalSelected
              ? `rgba(${statusToColorMap[status]}, 0.2)`
              : undefined,
          "& .MuiChip-label": {
            display: "flex",
            alignItems: "center",
            gap: "4px",
            overflow: truncate ? "hidden" : "visible",
          },
          transition: "all 0.2s ease-in-out",
          ...sx,
        }}
        {...props}
      />
    );

    let wrappedChip = chipElement;

    // Add badge if configured
    if (badge) {
      wrappedChip = (
        <Badge
          badgeContent={badge.content}
          color={statusToColorMap[badge.color || "default"] as any}
          variant={badge.variant || "standard"}
          max={badge.max}
          showZero={badge.showZero}
        >
          {wrappedChip}
        </Badge>
      );
    }

    // Add tooltip if provided
    if (tooltip) {
      wrappedChip = <Tooltip title={tooltip}>{wrappedChip}</Tooltip>;
    }

    return wrappedChip;
  }
);

Chip.displayName = "Chip";

// ChipGroup Component
export const ChipGroup = ({
  options,
  value = [],
  singleValue,
  multiSelect = false,
  maxSelections,
  minSelections,
  onChange,
  onSingleChange,
  size = "medium",
  variant = "filled",
  shape = "rounded",
  spacing = true,
  gap = 8,
  direction = "row",
  wrap = true,
  disabled = false,
  label,
  showSelectAll = false,
  showClearAll = false,
  ...chipProps
}: ChipGroupProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const [singleSelectedValue, setSingleSelectedValue] = useState<string | null>(
    singleValue || null
  );

  const handleChipClick = (optionValue: string) => {
    if (disabled) return;

    if (multiSelect) {
      let newValues: string[];
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter((v) => v !== optionValue);
      } else {
        if (maxSelections && selectedValues.length >= maxSelections) {
          return; // Don't allow more selections
        }
        newValues = [...selectedValues, optionValue];
      }

      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      const newValue = singleSelectedValue === optionValue ? null : optionValue;
      setSingleSelectedValue(newValue);
      onSingleChange?.(newValue);
    }
  };

  const handleSelectAll = () => {
    if (!multiSelect) return;
    const allValues = options
      .filter((opt) => !opt.disabled)
      .map((opt) => opt.value);
    setSelectedValues(allValues);
    onChange?.(allValues);
  };

  const handleClearAll = () => {
    if (multiSelect) {
      setSelectedValues([]);
      onChange?.([]);
    } else {
      setSingleSelectedValue(null);
      onSingleChange?.(null);
    }
  };

  const isSelected = (optionValue: string) => {
    return multiSelect
      ? selectedValues.includes(optionValue)
      : singleSelectedValue === optionValue;
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}

      {(showSelectAll || showClearAll) && multiSelect && (
        <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
          {showSelectAll && (
            <Button
              size="small"
              variant="text"
              onClick={handleSelectAll}
              disabled={disabled}
            >
              Select All
            </Button>
          )}
          {showClearAll && (
            <Button
              size="small"
              variant="text"
              onClick={handleClearAll}
              disabled={disabled}
            >
              Clear All
            </Button>
          )}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: direction,
          flexWrap: wrap ? "wrap" : "nowrap",
          gap: spacing ? gap / 8 : 0,
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        {" "}
        {options.map((option) => (
          <MUIChip
            key={option.value}
            size={size === "large" ? "medium" : size}
            variant={variant === "outlined" ? "outlined" : "filled"}
            color={statusToColorMap[option.color || "default"] as any}
            icon={option.icon}
            clickable={!option.disabled}
            onClick={() => handleChipClick(option.value)}
            label={option.label}
            sx={{
              opacity: option.disabled ? 0.5 : 1,
              pointerEvents: option.disabled ? "none" : "auto",
              backgroundColor: isSelected(option.value)
                ? "rgba(25, 118, 210, 0.12)"
                : undefined,
              borderColor: isSelected(option.value) ? "#1976d2" : undefined,
              borderRadius:
                shape === "square"
                  ? "4px"
                  : shape === "circular"
                    ? "50%"
                    : undefined,
              height:
                size === "small"
                  ? "24px"
                  : size === "medium"
                    ? "32px"
                    : size === "large"
                      ? "40px"
                      : "32px",
              fontSize:
                size === "small"
                  ? "0.75rem"
                  : size === "medium"
                    ? "0.875rem"
                    : size === "large"
                      ? "1rem"
                      : "0.875rem",
              padding: size === "large" ? "0 16px" : undefined,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

ChipGroup.displayName = "ChipGroup";
