import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Chip,
  Box,
  TextField,
  ListSubheader,
  Checkbox,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Autocomplete,
  Popper,
  Paper,
} from "@mui/material";
import { Search, X, Check, Plus } from "lucide-react";
import { SelectProps, SelectOption, AsyncSelectProps } from "./select.types";

// Helper function to debounce async calls
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Helper function to group options
const groupOptions = (
  options: SelectOption[],
  groupBy?: keyof SelectOption
) => {
  if (!groupBy) return { ungrouped: options };

  return options.reduce(
    (groups, option) => {
      const group = (option[groupBy] as string) || "Other";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    },
    {} as Record<string, SelectOption[]>
  );
};

export const Select: React.FC<SelectProps> = ({
  options = [],
  variant = "outlined",
  size = "medium",
  errorMessage,
  isLoading,
  error,
  helperText,
  startIcon,
  endIcon,
  showBottomMargin = false,
  fullWidth = false,
  label,
  multiple = false,
  searchable = false,
  searchPlaceholder = "Search options...",
  groupBy,
  renderGroup,
  renderOption,
  renderValue,
  creatable = false,
  onCreateOption,
  maxSelections,
  clearSearchOnSelect = true,
  closeMenuOnSelect = !multiple,
  chipProps,
  enableSelectAll = false,
  selectAllText = "Select All",
  noOptionsText = "No options available",
  loadingText = "Loading...",
  showDescriptions = false,
  validate,
  onInputChange,
  value,
  onChange,
  sx,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalValue, setInternalValue] = useState(multiple ? [] : "");
  const [validationError, setValidationError] = useState<string>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calculate whether to show margin based on error state and showBottomMargin prop
  const hasError = error || Boolean(errorMessage) || Boolean(validationError);
  const showMargin = showBottomMargin && !hasError && !helperText;
  const labelId = `select-label-${label?.toString().toLowerCase().replace(/\s+/g, "-")}`;

  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;

  // Handle search term changes
  const handleSearchChange = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
      if (onInputChange) {
        onInputChange(newSearchTerm);
      }
    },
    [onInputChange]
  );

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.description &&
          option.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm, searchable]);

  // Group filtered options
  const groupedOptions = useMemo(() => {
    return groupOptions(filteredOptions, groupBy);
  }, [filteredOptions, groupBy]);

  // Handle value change
  const handleChange = useCallback(
    (event: any, newValue?: any) => {
      let selectedValue =
        newValue !== undefined ? newValue : event.target.value;

      // Handle multiple selection limits
      if (multiple && maxSelections && Array.isArray(selectedValue)) {
        if (selectedValue.length > maxSelections) {
          selectedValue = selectedValue.slice(0, maxSelections);
        }
      } // Handle select all for multiple
      if (multiple && selectedValue.includes("__SELECT_ALL__")) {
        const allValues = filteredOptions.map((option) => option.value);
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        selectedValue =
          selectedValue.includes("__SELECT_ALL__") &&
          currentArray.length === allValues.length
            ? []
            : allValues;
      }

      // Validate if validation function is provided
      if (validate) {
        const error = validate(selectedValue);
        setValidationError(error);
      }

      // Update internal value if uncontrolled
      if (value === undefined) {
        setInternalValue(selectedValue);
      } // Clear search on select if enabled
      if (clearSearchOnSelect && !multiple) {
        handleSearchChange("");
      }

      // Call onChange if provided
      if (onChange) {
        onChange(event, selectedValue);
      }
    },
    [
      multiple,
      maxSelections,
      filteredOptions,
      currentValue,
      clearSearchOnSelect,
      validate,
      value,
      onChange,
    ]
  );

  // Handle option creation
  const handleCreateOption = useCallback(async () => {
    if (!creatable || !onCreateOption || !searchTerm.trim()) return;

    try {
      const newOption = await onCreateOption(searchTerm.trim());

      // Add the new option to selection
      const newValue = multiple
        ? [
            ...(Array.isArray(currentValue) ? currentValue : []),
            newOption.value,
          ]
        : newOption.value;
      handleChange({ target: { value: newValue } });
      handleSearchChange("");
    } catch (error) {
      console.error("Failed to create option:", error);
    }
  }, [
    creatable,
    onCreateOption,
    searchTerm,
    multiple,
    currentValue,
    handleChange,
  ]);

  // Custom render value for multiple selection
  const customRenderValue = useCallback(
    (selected: any) => {
      if (renderValue) {
        return renderValue(selected);
      }

      if (!multiple) {
        const option = options.find((opt) => opt.value === selected);
        return option?.label || "";
      }

      if (!Array.isArray(selected) || selected.length === 0) {
        return "";
      }

      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Chip
                key={value}
                label={option?.label || value}
                size="small"
                onDelete={() => {
                  const newValue = selected.filter((v: any) => v !== value);
                  handleChange({ target: { value: newValue } });
                }}
                {...chipProps}
              />
            );
          })}
        </Box>
      );
    },
    [renderValue, multiple, options, chipProps, handleChange]
  );

  // Render search input if searchable
  const renderSearchInput = () => {
    if (!searchable) return null;

    return (
      <Box sx={{ p: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <TextField
          ref={searchInputRef}
          fullWidth
          size="small"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleSearchChange("")}
                  edge="end"
                >
                  <X size={14} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        />
      </Box>
    );
  };

  // Render create option if creatable and no exact match
  const renderCreateOption = () => {
    if (!creatable || !searchTerm.trim()) return null;

    const exactMatch = filteredOptions.some(
      (option) => option.label.toLowerCase() === searchTerm.toLowerCase()
    );

    if (exactMatch) return null;

    return (
      <MenuItem
        value="__CREATE_NEW__"
        onClick={handleCreateOption}
        sx={{
          fontStyle: "italic",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "primary.light",
            color: "primary.contrastText",
          },
        }}
      >
        <Plus size={16} style={{ marginRight: 8 }} />
        Create "{searchTerm}"
      </MenuItem>
    );
  };

  // Render select all option for multiple
  const renderSelectAllOption = () => {
    if (!multiple || !enableSelectAll || filteredOptions.length === 0)
      return null;

    const allSelected = filteredOptions.every(
      (option) =>
        Array.isArray(currentValue) && currentValue.includes(option.value)
    );

    return (
      <>
        <MenuItem
          value="__SELECT_ALL__"
          onClick={(e) => {
            e.preventDefault();
            const allValues = filteredOptions.map((option) => option.value);
            const newValue = allSelected ? [] : allValues;
            handleChange({ target: { value: newValue } });
          }}
        >
          <Checkbox
            checked={allSelected}
            indeterminate={
              Array.isArray(currentValue) &&
              currentValue.length > 0 &&
              currentValue.length < filteredOptions.length
            }
          />
          <ListItemText primary={selectAllText} />
        </MenuItem>
        <Divider />
      </>
    );
  };

  // Render individual option
  const renderIndividualOption = (option: SelectOption, index: number) => {
    if (renderOption) {
      return renderOption(option, index);
    }

    const isSelected = multiple
      ? Array.isArray(currentValue) && currentValue.includes(option.value)
      : currentValue === option.value;

    return (
      <MenuItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        sx={{
          py: showDescriptions ? 1.5 : 1,
          "&.Mui-selected": multiple ? {} : undefined,
        }}
      >
        {multiple && <Checkbox checked={isSelected} sx={{ mr: 1 }} />}

        {option.avatar && (
          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>{option.avatar}</Avatar>
        )}

        {option.icon && (
          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
            {option.icon}
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" component="div">
            {option.label}
          </Typography>
          {showDescriptions && option.description && (
            <Typography variant="caption" color="text.secondary">
              {option.description}
            </Typography>
          )}
        </Box>

        {!multiple && isSelected && (
          <Check size={16} style={{ marginLeft: 8 }} />
        )}
      </MenuItem>
    );
  };

  // Render options with grouping
  const renderOptions = () => {
    if (isLoading) {
      return (
        <MenuItem disabled>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          {loadingText}
        </MenuItem>
      );
    }

    if (filteredOptions.length === 0) {
      return <MenuItem disabled>{noOptionsText}</MenuItem>;
    }

    const groups = Object.entries(groupedOptions);

    if (groups.length === 1 && groups[0][0] === "ungrouped") {
      // No grouping
      return (
        <>
          {renderSelectAllOption()}
          {filteredOptions.map((option, index) =>
            renderIndividualOption(option, index)
          )}
          {renderCreateOption()}
        </>
      );
    }

    // With grouping
    return (
      <>
        {renderSelectAllOption()}
        {groups.map(([groupName, groupOptions]) => (
          <React.Fragment key={groupName}>
            {renderGroup ? (
              renderGroup(groupName, groupOptions)
            ) : (
              <ListSubheader>{groupName}</ListSubheader>
            )}
            {groupOptions.map((option, index) =>
              renderIndividualOption(option, index)
            )}
          </React.Fragment>
        ))}
        {renderCreateOption()}
      </>
    );
  };

  return (
    <FormControl
      variant={variant}
      size={size}
      error={hasError}
      fullWidth={fullWidth}
      sx={{
        ...sx,
        marginBottom: showMargin ? "1.5em" : undefined,
      }}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect
        {...props}
        labelId={labelId}
        label={label}
        multiple={multiple}
        value={currentValue}
        onChange={handleChange}
        renderValue={multiple ? customRenderValue : renderValue}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              "& .MuiMenuItem-root": {
                borderRadius: 0,
              },
            },
          },
          ...props.MenuProps,
        }}
        startAdornment={
          startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : null
        }
        endAdornment={
          <>
            {isLoading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            )}
            {endIcon && (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            )}
          </>
        }
      >
        {renderSearchInput()}
        {renderOptions()}
      </MuiSelect>
      {(errorMessage || validationError || helperText) && (
        <FormHelperText>
          {errorMessage || validationError || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

// Async Select Component
export const AsyncSelect: React.FC<AsyncSelectProps> = ({
  loadOptions,
  defaultOptions = false,
  loadOptionsOnFocus = false,
  cacheOptions = true,
  debounceMs = 300,
  ...props
}) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cache, setCache] = useState<Record<string, SelectOption[]>>({});

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Load options on mount if defaultOptions is true
  useEffect(() => {
    if (defaultOptions === true) {
      handleLoadOptions("");
    } else if (Array.isArray(defaultOptions)) {
      setOptions(defaultOptions);
    }
  }, []);

  // Load options when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm || !defaultOptions) {
      handleLoadOptions(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleLoadOptions = useCallback(
    async (inputValue: string) => {
      // Check cache first
      if (cacheOptions && cache[inputValue]) {
        setOptions(cache[inputValue]);
        return;
      }

      setLoading(true);
      try {
        const newOptions = await loadOptions(inputValue);
        setOptions(newOptions);

        // Update cache
        if (cacheOptions) {
          setCache((prev) => ({ ...prev, [inputValue]: newOptions }));
        }
      } catch (error) {
        console.error("Failed to load options:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [loadOptions, cacheOptions, cache]
  );
  return (
    <Select
      {...props}
      options={options}
      isLoading={loading}
      searchable={true}
      onInputChange={(inputValue: string) => {
        setSearchTerm(inputValue);
      }}
    />
  );
};

export default Select;
