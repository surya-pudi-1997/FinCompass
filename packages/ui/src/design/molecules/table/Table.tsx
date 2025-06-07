import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useCallback,
  useRef,
  Fragment,
} from "react";
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination as MUITablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Collapse,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Skeleton,
  Box,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import {
  TableProps,
  TableRef,
  TableColumn,
  TableRow as TableRowType,
  SortDirection,
} from "./table.types";

const Table = forwardRef<TableRef, TableProps>((props, ref) => {
  const {
    columns,
    rows,
    loading = false,
    loadingRows = 5,
    loadingText = "Loading...",
    emptyStateText = "No data available",
    emptyStateIcon,
    emptyStateAction,
    pagination,
    onPageChange,
    onRowsPerPageChange,
    sortable = true,
    sort,
    onSortChange,
    filterable = false,
    filters = [],
    onFiltersChange,
    searchable = false,
    searchValue = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    selection,
    actions = [],
    rowActions = [],
    expandable = false,
    expandedRows = [],
    onExpandedRowsChange,
    dense = false,
    striped = false,
    hover = true,
    bordered = false,
    stickyHeader = false,
    maxHeight,
    minHeight,
    elevation = 1,
    variant = "elevation",
    paperProps,
    containerSx,
    tableSx,
    customEmptyState,
    customLoadingState,
    customToolbar,
    onRowClick,
    onRowDoubleClick,
    onCellClick,
    ariaLabel,
    ariaLabelledBy,
    ...tableProps
  } = props;

  // Local state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [internalExpandedRows, setInternalExpandedRows] = useState<
    (string | number)[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const getCellValue = (row: TableRowType, column: TableColumn) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row.data);
    }
    if (column.accessor) {
      return row.data[column.accessor];
    }
    return "";
  };

  // Computed values
  const isExpanded =
    expandedRows.length > 0 ? expandedRows : internalExpandedRows;
  const selectedRowsData = useMemo(() => {
    if (!selection) return [];
    return rows
      .filter((row) => selection.selectedRows.includes(row.id))
      .map((row) => row.data);
  }, [rows, selection?.selectedRows]);

  const filteredRows = useMemo(() => {
    if (!searchValue && (!filters || filters.length === 0)) return rows;

    return rows.filter((row) => {
      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        const matchesSearch = columns.some((column) => {
          const value = getCellValue(row, column);
          return String(value).toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      // Column filters
      if (filters && filters.length > 0) {
        return filters.every((filter) => {
          const column = columns.find((col) => col.id === filter.column);
          if (!column) return true;

          const value = getCellValue(row, column);
          const filterValue = filter.value;

          switch (filter.operator || "contains") {
            case "equals":
              return value === filterValue;
            case "contains":
              return String(value)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase());
            case "startsWith":
              return String(value)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase());
            case "endsWith":
              return String(value)
                .toLowerCase()
                .endsWith(String(filterValue).toLowerCase());
            case "gt":
              return Number(value) > Number(filterValue);
            case "gte":
              return Number(value) >= Number(filterValue);
            case "lt":
              return Number(value) < Number(filterValue);
            case "lte":
              return Number(value) <= Number(filterValue);
            default:
              return true;
          }
        });
      }

      return true;
    });
  }, [rows, searchValue, filters, columns]);

  const sortedRows = useMemo(() => {
    if (!sort || !sort.direction) return filteredRows;

    const column = columns.find((col) => col.id === sort.column);
    if (!column) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aValue = getCellValue(a, column);
      const bValue = getCellValue(b, column);

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredRows, sort, columns]);

  const handleSort = (columnId: string) => {
    if (!sortable || !onSortChange) return;

    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    let newDirection: SortDirection = "asc";
    if (sort?.column === columnId) {
      if (sort.direction === "asc") newDirection = "desc";
      else if (sort.direction === "desc") newDirection = false;
    }

    onSortChange({ column: columnId, direction: newDirection });
  };

  const handleSelectAll = () => {
    if (!selection) return;

    const allSelectableRows = sortedRows
      .filter((row) => row.selectable !== false)
      .map((row) => row.id);

    const isAllSelected = allSelectableRows.every((id) =>
      selection.selectedRows.includes(id)
    );

    const newSelection = isAllSelected ? [] : allSelectableRows;
    const newData = isAllSelected
      ? []
      : sortedRows
          .filter((row) => allSelectableRows.includes(row.id))
          .map((row) => row.data);

    selection.onSelectionChange(newSelection, newData);
  };

  const handleRowSelect = (rowId: string | number) => {
    if (!selection) return;

    const isSelected = selection.selectedRows.includes(rowId);
    let newSelection: (string | number)[];

    if (selection.type === "single") {
      newSelection = isSelected ? [] : [rowId];
    } else {
      newSelection = isSelected
        ? selection.selectedRows.filter((id) => id !== rowId)
        : [...selection.selectedRows, rowId];
    }

    const newData = rows
      .filter((row) => newSelection.includes(row.id))
      .map((row) => row.data);

    selection.onSelectionChange(newSelection, newData);
  };

  const handleExpandRow = (rowId: string | number) => {
    const currentExpanded =
      expandedRows.length > 0 ? expandedRows : internalExpandedRows;
    const isExpanded = currentExpanded.includes(rowId);
    const newExpanded = isExpanded
      ? currentExpanded.filter((id) => id !== rowId)
      : [...currentExpanded, rowId];

    if (onExpandedRowsChange) {
      onExpandedRowsChange(newExpanded);
    } else {
      setInternalExpandedRows(newExpanded);
    }
  };

  const handleActionClick = (action: any) => {
    if (action.confirmMessage) {
      setPendingAction(action);
      setActionDialogOpen(true);
    } else {
      action.onClick(selection?.selectedRows || [], selectedRowsData);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      pendingAction.onClick(selection?.selectedRows || [], selectedRowsData);
      setPendingAction(null);
    }
    setActionDialogOpen(false);
  };

  const exportData = useCallback(
    (format: "csv" | "json" = "csv") => {
      const dataToExport = sortedRows.map((row) => {
        const exportRow: any = {};
        columns.forEach((column) => {
          if (!column.hidden) {
            exportRow[column.id] = getCellValue(row, column);
          }
        });
        return exportRow;
      });

      if (format === "csv") {
        const headers = columns
          .filter((col) => !col.hidden)
          .map((col) => col.id)
          .join(",");
        const csvContent = [
          headers,
          ...dataToExport.map((row) =>
            columns
              .filter((col) => !col.hidden)
              .map((col) => `"${row[col.id] || ""}"`)
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "table-data.csv";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "table-data.json";
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    [sortedRows, columns]
  );

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    scrollToRow: (rowId: string | number) => {
      // Implementation would depend on virtualization
      console.log("Scroll to row:", rowId);
    },
    clearSelection: () => {
      selection?.onSelectionChange([], []);
    },
    selectAll: handleSelectAll,
    exportData,
  }));

  // Render loading state
  if (loading && customLoadingState) {
    return customLoadingState;
  }

  if (loading) {
    return (
      <Paper
        elevation={elevation}
        variant={variant}
        sx={{ ...containerSx }}
        {...paperProps}
      >
        {/* Loading skeleton */}
        <Box p={2}>
          {Array.from({ length: loadingRows }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={dense ? 33 : 53}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Paper>
    );
  }

  // Render empty state
  if (sortedRows.length === 0 && !loading) {
    if (customEmptyState) {
      return customEmptyState;
    }

    return (
      <Paper
        elevation={elevation}
        variant={variant}
        sx={{ ...containerSx }}
        {...paperProps}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          minHeight={200}
        >
          {emptyStateIcon}
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {emptyStateText}
          </Typography>
          {emptyStateAction}
        </Box>
      </Paper>
    );
  }

  const visibleColumns = columns.filter((col) => !col.hidden);
  const hasSelection = selection && selection.type;
  const hasRowActions = rowActions.length > 0;
  const hasExpansion = expandable;

  return (
    <Paper
      elevation={elevation}
      variant={variant}
      sx={{ width: "100%", ...containerSx }}
      {...paperProps}
    >
      {/* Toolbar */}
      {(searchable || filterable || actions.length > 0 || customToolbar) && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selection?.selectedRows.length &&
              selection.selectedRows.length > 0 && {
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.activatedOpacity
                  ),
              }),
          }}
        >
          {selection?.selectedRows.length &&
          selection.selectedRows.length > 0 ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selection.selectedRows.length} selected
            </Typography>
          ) : (
            <>
              {searchable && (
                <TextField
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mr: 2, minWidth: 200 }}
                />
              )}
              <Box sx={{ flex: "1 1 100%" }} />
            </>
          )}

          {/* Actions */}
          {actions.map((action) => {
            const isDisabled =
              typeof action.disabled === "function"
                ? action.disabled(
                    selection?.selectedRows || [],
                    selectedRowsData
                  )
                : action.disabled;

            const requiresSelection =
              action.requiresSelection &&
              (!selection?.selectedRows.length ||
                selection.selectedRows.length === 0);

            return (
              <Tooltip key={action.id} title={action.label}>
                <span>
                  <IconButton
                    onClick={() => handleActionClick(action)}
                    disabled={isDisabled || requiresSelection}
                    color={action.color || "default"}
                  >
                    {action.icon}
                  </IconButton>
                </span>
              </Tooltip>
            );
          })}
          {filterable && (
            <Tooltip title="Filter">
              <IconButton onClick={(e) => setFilterAnchorEl(e.currentTarget)}>
                <Filter size={16} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Export">
            <IconButton onClick={() => exportData("csv")}>
              <Download size={16} />
            </IconButton>
          </Tooltip>

          {customToolbar}
        </Toolbar>
      )}

      {/* Table */}
      <TableContainer
        ref={containerRef}
        sx={{
          maxHeight,
          minHeight,
          overflowX: "auto",
        }}
      >
        <MUITable
          stickyHeader={stickyHeader}
          size={dense ? "small" : "medium"}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          sx={{
            ...(bordered && {
              "& .MuiTableCell-root": {
                borderRight: "1px solid",
                borderColor: "divider",
              },
            }),
            ...tableSx,
          }}
          {...tableProps}
        >
          <TableHead>
            <TableRow>
              {/* Selection column */}
              {hasSelection && (
                <TableCell padding="checkbox">
                  {selection?.type === "multiple" &&
                    selection.selectAllEnabled !== false && (
                      <Checkbox
                        indeterminate={
                          selection.selectedRows.length > 0 &&
                          selection.selectedRows.length <
                            sortedRows.filter((row) => row.selectable !== false)
                              .length
                        }
                        checked={
                          sortedRows.filter((row) => row.selectable !== false)
                            .length > 0 &&
                          sortedRows
                            .filter((row) => row.selectable !== false)
                            .every((row) =>
                              selection.selectedRows.includes(row.id)
                            )
                        }
                        onChange={handleSelectAll}
                      />
                    )}
                </TableCell>
              )}

              {/* Expansion column */}
              {hasExpansion && <TableCell />}

              {/* Data columns */}
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  padding="normal"
                  sortDirection={
                    sort?.column === column.id ? sort.direction || false : false
                  }
                  sx={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...(column.sticky && {
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                    }),
                  }}
                  {...column.headerProps}
                >
                  {column.sortable && sortable ? (
                    <TableSortLabel
                      active={sort?.column === column.id}
                      direction={
                        sort?.column === column.id
                          ? sort.direction || "asc"
                          : "asc"
                      }
                      onClick={() => handleSort(column.id)}
                    >
                      {column.headerFormat
                        ? column.headerFormat(String(column.label))
                        : column.label}
                    </TableSortLabel>
                  ) : column.headerFormat ? (
                    column.headerFormat(String(column.label))
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {/* Row actions column */}
              {hasRowActions && (
                <TableCell align="right" padding="normal">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row, index) => {
              const isSelected =
                selection?.selectedRows.includes(row.id) || false;
              const isRowExpanded = isExpanded.includes(row.id);

              return (
                <Fragment key={row.id}>
                  <TableRow
                    hover={hover}
                    selected={isSelected}
                    onClick={(event) => onRowClick?.(row, event)}
                    onDoubleClick={(event) => onRowDoubleClick?.(row, event)}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      ...(striped &&
                        index % 2 === 1 && {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.action.hover, 0.04),
                        }),
                      ...(row.disabled && {
                        opacity: 0.5,
                        pointerEvents: "none",
                      }),
                    }}
                  >
                    {/* Selection cell */}
                    {hasSelection && (
                      <TableCell padding="checkbox">
                        {row.selectable !== false && (
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleRowSelect(row.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </TableCell>
                    )}

                    {/* Expansion cell */}
                    {hasExpansion && (
                      <TableCell>
                        {row.expandable !== false && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandRow(row.id);
                            }}
                          >
                            {isRowExpanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </IconButton>
                        )}
                      </TableCell>
                    )}

                    {/* Data cells */}
                    {visibleColumns.map((column) => {
                      const value = getCellValue(row, column);
                      const cellProps =
                        typeof column.cellProps === "function"
                          ? column.cellProps(row.data, value)
                          : column.cellProps;

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                          onClick={(event) => {
                            event.stopPropagation();
                            onCellClick?.(row, column, value, event);
                          }}
                          sx={{
                            ...(column.sticky && {
                              position: "sticky",
                              left: 0,
                              zIndex: 1,
                            }),
                          }}
                          {...cellProps}
                        >
                          {column.format
                            ? column.format(value, row.data)
                            : String(value || "")}
                        </TableCell>
                      );
                    })}

                    {/* Row actions cell */}
                    {hasRowActions && (
                      <TableCell align="right">
                        {rowActions.map((action) => (
                          <Tooltip key={action.id} title={action.label}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick([row.id], [row.data]);
                              }}
                              disabled={
                                typeof action.disabled === "function"
                                  ? action.disabled([row.id], [row.data])
                                  : action.disabled
                              }
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </TableCell>
                    )}
                  </TableRow>

                  {/* Expanded content */}
                  {hasExpansion && row.expandable !== false && (
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={
                          visibleColumns.length +
                          (hasSelection ? 1 : 0) +
                          (hasExpansion ? 1 : 0) +
                          (hasRowActions ? 1 : 0)
                        }
                      >
                        <Collapse
                          in={isRowExpanded}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>{row.expandedContent}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </MUITable>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <MUITablePagination
          rowsPerPageOptions={pagination.rowsPerPageOptions || [5, 10, 25, 50]}
          component="div"
          count={pagination.totalRows}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange?.(parseInt(e.target.value, 10))
          }
          showFirstButton={pagination.showFirstButton}
          showLastButton={pagination.showLastButton}
        />
      )}

      {/* Action confirmation dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>{pendingAction?.confirmMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmAction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem onClick={() => setFilterAnchorEl(null)}>
          Clear Filters
        </MenuItem>
      </Menu>
    </Paper>
  );
});

Table.displayName = "Table";

export { Table };
