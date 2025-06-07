import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import {
  User,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building,
  Heart,
  Shield,
} from "lucide-react";
import { Select, AsyncSelect } from "./Select";
import { SelectOption } from "./select.types";

const meta: Meta<typeof Select> = {
  title: "Design System/Molecules/Select",
  component: Select,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A comprehensive Select component built on top of Material-UI with advanced features including:

- **Multi-select** with chips and bulk actions
- **Search/Filter** functionality with debouncing
- **Async loading** with caching support
- **Option grouping** with custom renderers
- **Creatable options** for dynamic additions
- **Rich options** with icons, avatars, and descriptions
- **Validation** and error handling
- **Accessibility** features and keyboard navigation

## Features

### Basic Features
- Single and multiple selection
- Loading states and error handling
- Helper text and validation
- Customizable sizing and variants

### Advanced Features
- Searchable options with real-time filtering
- Async option loading with debouncing
- Option grouping and custom group renderers
- Rich option display with icons and descriptions
- Create new options on the fly
- Select all functionality for multiple selection
- Maximum selection limits
- Custom chip styling for multiple selection

### Accessibility
- Full keyboard navigation support
- Screen reader compatibility
- ARIA labels and descriptions
- Focus management
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["standard", "outlined", "filled"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium"],
    },
    multiple: { control: "boolean" },
    searchable: { control: "boolean" },
    creatable: { control: "boolean" },
    showDescriptions: { control: "boolean" },
    enableSelectAll: { control: "boolean" },
    fullWidth: { control: "boolean" },
    error: { control: "boolean" },
    isLoading: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const basicOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4", disabled: true },
  { value: "option5", label: "Option 5" },
];

const richOptions: SelectOption[] = [
  {
    value: "user1",
    label: "John Doe",
    description: "Software Engineer at TechCorp",
    icon: <User size={16} />,
    avatar: <Avatar sx={{ width: 24, height: 24 }}>JD</Avatar>,
  },
  {
    value: "user2",
    label: "Jane Smith",
    description: "Product Manager at InnovateCo",
    icon: <Star size={16} />,
    avatar: <Avatar sx={{ width: 24, height: 24 }}>JS</Avatar>,
  },
  {
    value: "user3",
    label: "Bob Johnson",
    description: "UX Designer at DesignStudio",
    icon: <Globe size={16} />,
    avatar: <Avatar sx={{ width: 24, height: 24 }}>BJ</Avatar>,
  },
  {
    value: "user4",
    label: "Alice Wilson",
    description: "Data Scientist at DataCorp",
    icon: <Shield size={16} />,
    avatar: <Avatar sx={{ width: 24, height: 24 }}>AW</Avatar>,
  },
];

const groupedOptions: SelectOption[] = [
  {
    value: "email",
    label: "Email",
    group: "Communication",
    icon: <Mail size={16} />,
  },
  {
    value: "phone",
    label: "Phone",
    group: "Communication",
    icon: <Phone size={16} />,
  },
  {
    value: "address",
    label: "Address",
    group: "Location",
    icon: <MapPin size={16} />,
  },
  {
    value: "office",
    label: "Office",
    group: "Location",
    icon: <Building size={16} />,
  },
  {
    value: "favorite",
    label: "Favorite",
    group: "Personal",
    icon: <Heart size={16} />,
  },
  {
    value: "profile",
    label: "Profile",
    group: "Personal",
    icon: <User size={16} />,
  },
];

const countryOptions: SelectOption[] = [
  { value: "us", label: "United States", description: "North America" },
  { value: "ca", label: "Canada", description: "North America" },
  { value: "uk", label: "United Kingdom", description: "Europe" },
  { value: "de", label: "Germany", description: "Europe" },
  { value: "fr", label: "France", description: "Europe" },
  { value: "jp", label: "Japan", description: "Asia" },
  { value: "cn", label: "China", description: "Asia" },
  { value: "au", label: "Australia", description: "Oceania" },
];

// Basic Select
export const Default: Story = {
  args: {
    label: "Select an option",
    options: basicOptions,
    fullWidth: true,
  },
};

// Multiple Selection
export const Multiple: Story = {
  args: {
    label: "Select multiple options",
    options: basicOptions,
    multiple: true,
    fullWidth: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <Select
        {...args}
        value={value}
        onChange={(_, newValue) => setValue(newValue as string[])}
      />
    );
  },
};

// Searchable Select
export const Searchable: Story = {
  args: {
    label: "Search and select",
    options: countryOptions,
    searchable: true,
    showDescriptions: true,
    fullWidth: true,
  },
  render: (args) => {
    const [value, setValue] = useState("");

    return (
      <Select
        {...args}
        value={value}
        onChange={(_, newValue) => setValue(newValue as string)}
      />
    );
  },
};

// Multiple with Search and Select All
export const MultipleWithFeatures: Story = {
  args: {
    label: "Advanced multiple select",
    options: richOptions,
    multiple: true,
    searchable: true,
    enableSelectAll: true,
    showDescriptions: true,
    maxSelections: 3,
    chipProps: { size: "small", variant: "outlined" },
    fullWidth: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <Box>
        <Select
          {...args}
          value={value}
          onChange={(_, newValue) => setValue(newValue as string[])}
        />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          Selected: {value.length}/{args.maxSelections} (Max:{" "}
          {args.maxSelections})
        </Typography>
      </Box>
    );
  },
};

// Grouped Options
export const GroupedOptions: Story = {
  args: {
    label: "Select by category",
    options: groupedOptions,
    groupBy: "group",
    searchable: true,
    fullWidth: true,
  },
  render: (args) => {
    const [value, setValue] = useState("");

    return (
      <Select
        {...args}
        value={value}
        onChange={(_, newValue) => setValue(newValue as string)}
      />
    );
  },
};

// Creatable Options
export const Creatable: Story = {
  args: {
    label: "Select or create new",
    searchable: true,
    creatable: true,
    multiple: true,
    fullWidth: true,
  },
  render: (args) => {
    const [options, setOptions] = useState(basicOptions);
    const [value, setValue] = useState<string[]>([]);

    const handleCreateOption = (inputValue: string) => {
      const newOption: SelectOption = {
        value: inputValue.toLowerCase().replace(/\s+/g, "-"),
        label: inputValue,
      };
      setOptions((prev) => [...prev, newOption]);
      return newOption;
    };

    return (
      <Select
        {...args}
        options={options}
        value={value}
        onChange={(_, newValue) => setValue(newValue as string[])}
        onCreateOption={handleCreateOption}
      />
    );
  },
};

// Rich Options with Custom Rendering
export const RichOptions: Story = {
  args: {
    label: "Select team member",
    options: richOptions,
    showDescriptions: true,
    searchable: true,
    fullWidth: true,
  },
  render: (args) => {
    const [value, setValue] = useState("");

    return (
      <Select
        {...args}
        value={value}
        onChange={(_, newValue) => setValue(newValue as string)}
        renderValue={(selected) => {
          const option = richOptions.find((opt) => opt.value === selected);
          if (!option) return "";

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {option.avatar}
              <Typography variant="body2">{option.label}</Typography>
            </Box>
          );
        }}
      />
    );
  },
};

// Loading State
export const Loading: Story = {
  args: {
    label: "Loading options",
    options: [],
    isLoading: true,
    loadingText: "Fetching data...",
    fullWidth: true,
  },
};

// Error State
export const ErrorState: Story = {
  args: {
    label: "Select with error",
    options: basicOptions,
    error: true,
    errorMessage: "This field is required",
    fullWidth: true,
  },
};

// With Validation
export const WithValidation: Story = {
  args: {
    label: "Select with validation",
    options: basicOptions,
    multiple: true,
    fullWidth: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);

    const validate = (selected: string[]) => {
      if (selected.length < 2) {
        return "Please select at least 2 options";
      }
      if (selected.length > 3) {
        return "Maximum 3 selections allowed";
      }
      return undefined;
    };

    return (
      <Select
        {...args}
        value={value}
        onChange={(_, newValue) => setValue(newValue as string[])}
        validate={validate}
      />
    );
  },
};

// Different Sizes and Variants
export const SizesAndVariants: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Sizes
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Select
            label="Small"
            options={basicOptions}
            size="small"
            value="option1"
          />
          <Select
            label="Medium"
            options={basicOptions}
            size="medium"
            value="option1"
          />
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Variants
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Select
            label="Outlined"
            options={basicOptions}
            variant="outlined"
            value="option1"
          />
          <Select
            label="Filled"
            options={basicOptions}
            variant="filled"
            value="option1"
          />
          <Select
            label="Standard"
            options={basicOptions}
            variant="standard"
            value="option1"
          />
        </Box>
      </Box>
    </Box>
  ),
};

// Async Select Example
export const AsyncLoading: Story = {
  render: () => {
    const loadOptions = async (inputValue: string): Promise<SelectOption[]> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const allOptions = [
        { value: "apple", label: "Apple", description: "A sweet red fruit" },
        {
          value: "banana",
          label: "Banana",
          description: "A yellow tropical fruit",
        },
        { value: "cherry", label: "Cherry", description: "A small red fruit" },
        { value: "date", label: "Date", description: "A sweet brown fruit" },
        {
          value: "elderberry",
          label: "Elderberry",
          description: "A dark purple berry",
        },
        {
          value: "fig",
          label: "Fig",
          description: "A sweet purple or green fruit",
        },
        {
          value: "grape",
          label: "Grape",
          description: "Small round fruits in bunches",
        },
        {
          value: "honeydew",
          label: "Honeydew",
          description: "A sweet green melon",
        },
      ];

      return allOptions.filter(
        (option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.description.toLowerCase().includes(inputValue.toLowerCase())
      );
    };

    const [value, setValue] = useState("");

    return (
      <AsyncSelect
        label="Search fruits"
        value={value}
        onChange={(_, newValue) => setValue(newValue as string)}
        loadOptions={loadOptions}
        defaultOptions={true}
        showDescriptions={true}
        cacheOptions={true}
        debounceMs={500}
        fullWidth
      />
    );
  },
};

// Custom Chip Styling for Multiple
export const CustomChipStyling: Story = {
  args: {
    label: "Custom chip styling",
    options: richOptions,
    multiple: true,
    fullWidth: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);

    return (
      <Select
        {...args}
        value={value}
        onChange={(_, newValue) => setValue(newValue as string[])}
        chipProps={{
          variant: "outlined",
          color: "primary",
          size: "small",
          sx: {
            borderRadius: "16px",
            "& .MuiChip-deleteIcon": {
              color: "primary.main",
              "&:hover": {
                color: "primary.dark",
              },
            },
          },
        }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {(selected as string[]).map((value) => {
              const option = richOptions.find((opt) => opt.value === value);
              return (
                <Chip
                  key={value}
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {option?.icon}
                      {option?.label || value}
                    </Box>
                  }
                  onDelete={() => {
                    const newValue = (selected as string[]).filter(
                      (v: string) => v !== value
                    );
                    setValue(newValue);
                  }}
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ borderRadius: "16px" }}
                />
              );
            })}
          </Box>
        )}
      />
    );
  },
};

// Kitchen Sink - All Features
export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    const [options, setOptions] = useState(groupedOptions);

    const handleCreateOption = (inputValue: string) => {
      const newOption: SelectOption = {
        value: inputValue.toLowerCase().replace(/\s+/g, "-"),
        label: inputValue,
        group: "Custom",
        icon: <User size={16} />,
      };
      setOptions((prev) => [...prev, newOption]);
      return newOption;
    };

    const validate = (selected: string[]) => {
      if (selected.length === 0) {
        return "Please select at least one option";
      }
      return undefined;
    };

    return (
      <Box sx={{ maxWidth: 400 }}>
        <Select
          label="Kitchen Sink Select"
          options={options}
          value={value}
          onChange={(_, newValue) => setValue(newValue as string[])}
          multiple
          searchable
          creatable
          enableSelectAll
          groupBy="group"
          showDescriptions
          maxSelections={5}
          searchPlaceholder="Search or create new..."
          selectAllText="Select All Items"
          noOptionsText="No matching options found"
          clearSearchOnSelect={false}
          closeMenuOnSelect={false}
          onCreateOption={handleCreateOption}
          validate={validate}
          chipProps={{
            size: "small",
            variant: "outlined",
            color: "primary",
          }}
          fullWidth
          helperText="Select up to 5 options. You can search, group, and create new items."
        />

        <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
          Selected: {value.length}/5
        </Typography>
      </Box>
    );
  },
};
