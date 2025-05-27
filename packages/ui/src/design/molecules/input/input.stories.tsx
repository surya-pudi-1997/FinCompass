import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { Search, User, Mail, Eye } from "lucide-react";

const meta = {
  title: "Design System/Molecules/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Label",
    placeholder: "Enter text",
  },
};

export const WithStartIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    startIcon: <Search size={20} />,
  },
};

export const WithEndIcon: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    endIcon: <User size={20} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: "Email",
    placeholder: "Enter email",
    startIcon: <Mail size={20} />,
    endIcon: <User size={20} />,
  },
};

export const WithError: Story = {
  args: {
    label: "Error State",
    placeholder: "Enter text",
    error: true,
    errorMessage: "This field is required",
    showBottomMargin: true, // This will be ignored due to error state
  },
};

export const WithHelper: Story = {
  args: {
    label: "Label",
    placeholder: "Enter text",
    helperText: "This is a helper text",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "With Helper",
    placeholder: "Enter text",
    helperText: "This is a helper text",
    showBottomMargin: true, // This will be ignored due to helper text
  },
};

export const Loading: Story = {
  args: {
    label: "Loading State",
    placeholder: "Enter text",
    isLoading: true,
    showBottomMargin: true,
  },
};

export const LoadingWithIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    startIcon: <Search size={20} />,
    isLoading: true,
  },
};

export const Filled: Story = {
  args: {
    label: "Label",
    placeholder: "Enter text",
    variant: "filled",
  },
};

export const Standard: Story = {
  args: {
    label: "Label",
    placeholder: "Enter text",
    variant: "standard",
  },
};

export const Small: Story = {
  args: {
    label: "Label",
    placeholder: "Enter text",
    size: "small",
  },
};

export const WithBottomMargin: Story = {
  args: {
    label: "With Bottom Margin",
    placeholder: "Enter text",
    showBottomMargin: true,
  },
};
