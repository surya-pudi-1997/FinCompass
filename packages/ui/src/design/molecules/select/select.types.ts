import {
  SelectProps as MuiSelectProps,
  AutocompleteProps,
  ChipProps,
} from "@mui/material";
import { ReactNode } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
  avatar?: ReactNode;
  group?: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps
  extends Omit<MuiSelectProps, "error" | "multiple"> {
  /** Array of options to display */
  options: SelectOption[];
  /** Error message to display */
  errorMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: boolean;
  /** Helper text to display */
  helperText?: string;
  /** Icon to display at the start */
  startIcon?: ReactNode;
  /** Icon to display at the end */
  endIcon?: ReactNode;
  /** Whether to show bottom margin */
  showBottomMargin?: boolean;
  /** Whether the select takes up the full width of its container */
  fullWidth?: boolean;
  /** Size of the select */
  size?: "small" | "medium";
  /** Variant of the select */
  variant?: "standard" | "outlined" | "filled";

  // Enhanced features
  /** Enable multiple selection */
  multiple?: boolean;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Enable option grouping */
  groupBy?: keyof SelectOption;
  /** Custom group renderer */
  renderGroup?: (group: string, options: SelectOption[]) => ReactNode;
  /** Custom option renderer */
  renderOption?: (option: SelectOption, index: number) => ReactNode;
  /** Custom value renderer for selected items */
  renderValue?: (selected: any) => ReactNode;
  /** Enable creation of new options */
  creatable?: boolean;
  /** Callback when a new option is created */
  onCreateOption?: (inputValue: string) => SelectOption | Promise<SelectOption>;
  /** Async loading function */
  loadOptions?: (inputValue: string) => Promise<SelectOption[]>;
  /** Debounce delay for async loading (ms) */
  debounceMs?: number;
  /** Maximum number of selections (for multiple) */
  maxSelections?: number;
  /** Whether to clear search on selection */
  clearSearchOnSelect?: boolean;
  /** Whether to close menu on selection (for multiple) */
  closeMenuOnSelect?: boolean;
  /** Custom chip props for multiple selection */
  chipProps?: Partial<ChipProps>;
  /** Enable select all option for multiple select */
  enableSelectAll?: boolean;
  /** Text for select all option */
  selectAllText?: string;
  /** Custom no options text */
  noOptionsText?: string;
  /** Custom loading text */
  loadingText?: string /** Whether options are virtualized for performance */;
  virtualized?: boolean;
  /** Height of virtualized list */
  listHeight?: number;
  /** Height of individual option items */
  itemHeight?: number;
  /** Validation function */
  validate?: (value: any) => string | undefined;
  /** Whether to show option descriptions */
  showDescriptions?: boolean;
  /** Maximum width of the dropdown */
  maxMenuWidth?: number | string;
  /** Minimum width of the dropdown */
  minMenuWidth?: number | string;
  /** Callback when input value changes (for searchable) */
  onInputChange?: (inputValue: string) => void;
}

export interface AsyncSelectProps extends Omit<SelectProps, "options"> {
  /** Default options to show initially */
  defaultOptions?: SelectOption[] | boolean;
  /** Function to load options asynchronously */
  loadOptions: (inputValue: string) => Promise<SelectOption[]>;
  /** Whether to load options on focus */
  loadOptionsOnFocus?: boolean;
  /** Cache loaded options */
  cacheOptions?: boolean;
}
