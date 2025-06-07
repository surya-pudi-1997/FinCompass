import { ChipProps as MUIChipProps } from "@mui/material";
import { ReactElement, ReactNode } from "react";

export type ChipStatus =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "primary"
  | "secondary";
export type ChipSize = "small" | "medium" | "large";
export type ChipShape = "rounded" | "square" | "circular";
export type ChipVariant = "filled" | "outlined" | "soft" | "ghost" | "gradient";

export interface ChipOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactElement;
  color?: ChipStatus;
}

export interface ChipGroupProps {
  /**
   * Array of chip options
   */
  options: ChipOption[];

  /**
   * Selected chip values (for multi-select)
   */
  value?: string[];

  /**
   * Selected chip value (for single-select)
   */
  singleValue?: string;

  /**
   * Enable multi-select mode
   * @default false
   */
  multiSelect?: boolean;

  /**
   * Maximum number of selections allowed
   */
  maxSelections?: number;

  /**
   * Minimum number of selections required
   */
  minSelections?: number;

  /**
   * Callback fired when selection changes
   */
  onChange?: (values: string[]) => void;

  /**
   * Callback fired when single selection changes
   */
  onSingleChange?: (value: string | null) => void;

  /**
   * Size of all chips in the group
   */
  size?: ChipSize;

  /**
   * Variant of all chips in the group
   */
  variant?: ChipVariant;

  /**
   * Shape of all chips in the group
   */
  shape?: ChipShape;

  /**
   * Enable spacing between chips
   * @default true
   */
  spacing?: boolean;

  /**
   * Custom spacing value
   */
  gap?: number;

  /**
   * Direction of chip layout
   * @default 'row'
   */
  direction?: "row" | "column";

  /**
   * Enable wrap for chips
   * @default true
   */
  wrap?: boolean;

  /**
   * Disable the entire group
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom label for the group
   */
  label?: string;

  /**
   * Show select all option (for multi-select)
   * @default false
   */
  showSelectAll?: boolean;

  /**
   * Show clear all option
   * @default false
   */
  showClearAll?: boolean;
}

export interface ChipProps
  extends Omit<
    MUIChipProps,
    "size" | "variant" | "icon" | "deleteIcon" | "color"
  > {
  /**
   * The size of the chip
   * @default 'medium'
   */
  size?: ChipSize;

  /**
   * The status color of the chip
   * @default 'default'
   */
  status?: ChipStatus;

  /**
   * The visual variant of the chip
   * @default 'filled'
   */
  variant?: ChipVariant;

  /**
   * The shape of the chip
   * @default 'rounded'
   */
  shape?: ChipShape;

  /**
   * Icon to be displayed at the start of the chip
   */
  leftIcon?: ReactElement;

  /**
   * Icon to be displayed at the end of the chip
   */
  rightIcon?: ReactElement;

  /**
   * Avatar to be displayed in the chip
   */
  avatar?: ReactElement;

  /**
   * If true, the text will be uppercase
   * @default false
   */
  uppercase?: boolean;

  /**
   * If true, the chip will be clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * If true, adds a delete action to the chip
   * @default false
   */
  deletable?: boolean;

  /**
   * Callback fired when the delete icon is clicked
   */
  onDelete?: () => void;

  /**
   * Custom tooltip text
   */
  tooltip?: string;

  /**
   * Enable loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Loading text to display
   */
  loadingText?: string;

  /**
   * Enable glow effect
   * @default false
   */
  glow?: boolean;

  /**
   * Enable pulse animation
   * @default false
   */
  pulse?: boolean;

  /**
   * Enable bounce animation on hover
   * @default false
   */
  bounce?: boolean;

  /**
   * Custom gradient colors (for gradient variant)
   */
  gradient?: {
    start: string;
    end: string;
    direction?: "to right" | "to left" | "to bottom" | "to top";
  };

  /**
   * Badge configuration
   */
  badge?: {
    content?: ReactNode;
    color?: ChipStatus;
    variant?: "dot" | "standard";
    max?: number;
    showZero?: boolean;
  };

  /**
   * Enable selection mode
   * @default false
   */
  selectable?: boolean;

  /**
   * Selected state (for selectable chips)
   * @default false
   */
  selected?: boolean;

  /**
   * Callback fired when selection changes
   */
  onSelectionChange?: (selected: boolean) => void;

  /**
   * Maximum width of the chip
   */
  maxWidth?: string | number;

  /**
   * Enable truncation with ellipsis
   * @default false
   */
  truncate?: boolean;

  /**
   * Custom close icon
   */
  closeIcon?: ReactElement;

  /**
   * Enable drag and drop
   * @default false
   */
  draggable?: boolean;

  /**
   * Drag start callback
   */
  onDragStart?: (event: React.DragEvent) => void;

  /**
   * Drag end callback
   */
  onDragEnd?: (event: React.DragEvent) => void;

  /**
   * Enable chip grouping
   * @default false
   */
  grouped?: boolean;

  /**
   * Group identifier
   */
  group?: string;

  /**
   * Priority level for sorting
   */
  priority?: number;

  /**
   * Custom validation
   */
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    message?: string;
  };

  /**
   * Accessibility label
   */
  ariaLabel?: string;

  /**
   * Accessibility described by
   */
  ariaDescribedBy?: string;
}
