import { ReactNode, MouseEvent } from "react";
import {
  TableProps as MUITableProps,
  TableCellProps,
  PaperProps,
  SxProps,
  Theme,
} from "@mui/material";

export type SortDirection = "asc" | "desc" | false;

export interface TableColumn<T = any> {
  id: string;
  label: ReactNode;
  accessor?: keyof T | ((row: T) => any);
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: TableCellProps["align"];
  format?: (value: any, row: T) => ReactNode;
  headerFormat?: (value: string) => ReactNode;
  cellProps?: TableCellProps | ((row: T, value: any) => TableCellProps);
  headerProps?: TableCellProps;
  sticky?: boolean;
  hidden?: boolean;
}

export interface TableRow<T = any> {
  id: string | number;
  data: T;
  selectable?: boolean;
  disabled?: boolean;
  expandable?: boolean;
  expandedContent?: ReactNode;
}

export interface TablePagination {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  rowsPerPageOptions?: number[];
  showFirstButton?: boolean;
  showLastButton?: boolean;
}

export interface TableSort {
  column: string;
  direction: SortDirection;
}

export interface TableFilter {
  column: string;
  value: any;
  operator?:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "gt"
    | "gte"
    | "lt"
    | "lte";
}

export interface TableSelection<T = any> {
  type: "single" | "multiple";
  selectedRows: (string | number)[];
  onSelectionChange: (
    selectedRows: (string | number)[],
    selectedData: T[]
  ) => void;
  selectAllEnabled?: boolean;
}

export interface TableAction<T = any> {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (selectedRows: (string | number)[], selectedData: T[]) => void;
  disabled?:
    | boolean
    | ((selectedRows: (string | number)[], selectedData: T[]) => boolean);
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  requiresSelection?: boolean;
  confirmMessage?: string;
}

export interface TableProps<T = any> {
  // Data
  columns: TableColumn<T>[];
  rows: TableRow<T>[];

  // Loading states
  loading?: boolean;
  loadingRows?: number;
  loadingText?: string;

  // Empty state
  emptyStateText?: string;
  emptyStateIcon?: ReactNode;
  emptyStateAction?: ReactNode;

  // Pagination
  pagination?: TablePagination;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;

  // Sorting
  sortable?: boolean;
  sort?: TableSort;
  onSortChange?: (sort: TableSort) => void;

  // Filtering
  filterable?: boolean;
  filters?: TableFilter[];
  onFiltersChange?: (filters: TableFilter[]) => void;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Selection
  selection?: TableSelection<T>;

  // Actions
  actions?: TableAction<T>[];
  rowActions?: TableAction<T>[];

  // Expansion
  expandable?: boolean;
  expandedRows?: (string | number)[];
  onExpandedRowsChange?: (expandedRows: (string | number)[]) => void;

  // Styling & Layout
  dense?: boolean;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string | number;
  minHeight?: string | number;
  elevation?: number;
  variant?: "elevation" | "outlined";

  // Container props
  paperProps?: PaperProps;
  containerSx?: SxProps<Theme>;
  tableSx?: SxProps<Theme>;

  // Virtualization (for large datasets)
  virtualized?: boolean;
  rowHeight?: number;

  // Custom renderers
  customEmptyState?: ReactNode;
  customLoadingState?: ReactNode;
  customToolbar?: ReactNode;

  // Event handlers
  onRowClick?: (
    row: TableRow<T>,
    event: MouseEvent<HTMLTableRowElement>
  ) => void;
  onRowDoubleClick?: (
    row: TableRow<T>,
    event: MouseEvent<HTMLTableRowElement>
  ) => void;
  onCellClick?: (
    row: TableRow<T>,
    column: TableColumn<T>,
    value: any,
    event: MouseEvent<HTMLTableCellElement>
  ) => void;

  // Accessibility
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export interface TableRef {
  scrollToTop: () => void;
  scrollToRow: (rowId: string | number) => void;
  clearSelection: () => void;
  selectAll: () => void;
  exportData: (format?: "csv" | "json") => void;
}
