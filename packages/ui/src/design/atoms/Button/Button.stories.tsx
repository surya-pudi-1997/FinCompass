import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Box } from "@mui/material";
import { Download, Plus, Heart, Settings } from "lucide-react";

import { Button, ButtonGroup } from "./Button";

const meta = {
  title: "Design System/Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    variant: {
      control: { type: "select" },
      options: ["text", "outlined", "contained"],
    },
    color: {
      control: { type: "select" },
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
      ],
    },
    shape: {
      control: { type: "select" },
      options: ["rounded", "square", "circular"],
    },
    loading: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    fullWidth: {
      control: { type: "boolean" },
    },
    uppercase: {
      control: { type: "boolean" },
    },
    glow: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Variants: Story = {
  render: () => (
    <Box display="flex" gap={2}>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap={2} alignItems="center">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box display="flex" gap={1} flexWrap="wrap">
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="error">Error</Button>
      <Button color="warning">Warning</Button>
      <Button color="info">Info</Button>
    </Box>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Box display="flex" gap={2} alignItems="center">
      <Button shape="rounded">Rounded</Button>
      <Button shape="square">Square</Button>
      <Button shape="circular">
        <Plus size={18} />
      </Button>
    </Box>
  ),
};

// Icons
export const WithIcons: Story = {
  render: () => (
    <Box display="flex" gap={2} flexDirection="column">
      <Box display="flex" gap={2}>
        <Button leftIcon={<Download size={18} />}>Download</Button>
        <Button rightIcon={<Plus size={18} />}>Add Item</Button>
        <Button
          leftIcon={<Heart size={18} />}
          rightIcon={<Settings size={18} />}
        >
          Both Icons
        </Button>
      </Box>
    </Box>
  ),
};

// States
export const Loading: Story = {
  render: () => (
    <Box display="flex" gap={2} flexDirection="column">
      <Box display="flex" gap={2}>
        <Button loading>Loading</Button>
        <Button loading loadingText="Saving...">
          Save
        </Button>
        <Button loading variant="outlined">
          Processing
        </Button>
      </Box>
    </Box>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Box display="flex" gap={2}>
      <Button disabled>Disabled</Button>
      <Button disabled variant="outlined">
        Disabled Outlined
      </Button>
      <Button disabled variant="text">
        Disabled Text
      </Button>
    </Box>
  ),
};

// Special Features
export const WithTooltip: Story = {
  args: {
    children: "Hover me",
    tooltip: "This is a helpful tooltip",
  },
};

export const WithGlow: Story = {
  render: () => (
    <Box display="flex" gap={2}>
      <Button glow>Glowing Button</Button>
      <Button glow variant="outlined" color="success">
        Success Glow
      </Button>
    </Box>
  ),
};

export const WithGradient: Story = {
  render: () => (
    <Box display="flex" gap={2} flexDirection="column">
      <Box display="flex" gap={2}>
        <Button gradient={{ start: "#667eea", end: "#764ba2" }}>
          Purple Gradient
        </Button>
        <Button
          gradient={{
            start: "#f093fb",
            end: "#f5576c",
            direction: "to bottom",
          }}
        >
          Pink Gradient
        </Button>
        <Button gradient={{ start: "#4facfe", end: "#00f2fe" }}>
          Blue Gradient
        </Button>
      </Box>
    </Box>
  ),
};

export const WithAnimations: Story = {
  render: () => (
    <Box display="flex" gap={2} flexWrap="wrap">
      <Button animation={{ type: "pulse", repeat: true }}>Pulse</Button>
      <Button animation={{ type: "bounce" }} color="success">
        Bounce
      </Button>
      <Button animation={{ type: "glow", repeat: true }} color="info">
        Glow
      </Button>
      <Button animation={{ type: "scale" }} color="warning">
        Scale
      </Button>
    </Box>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Box width={300}>
      <Button fullWidth>Full Width Button</Button>
    </Box>
  ),
};

// Button Group Examples
export const ButtonGroups: Story = {
  render: () => (
    <Box display="flex" gap={4} flexDirection="column">
      <Box>
        <h4>Attached Horizontal</h4>
        <ButtonGroup attached>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </ButtonGroup>
      </Box>

      <Box>
        <h4>Spaced Horizontal</h4>
        <ButtonGroup spacing="md">
          <Button variant="outlined">Option A</Button>
          <Button variant="outlined">Option B</Button>
          <Button variant="outlined">Option C</Button>
        </ButtonGroup>
      </Box>

      <Box>
        <h4>Vertical Group</h4>
        <ButtonGroup orientation="vertical" spacing="sm">
          <Button>Top</Button>
          <Button>Middle</Button>
          <Button>Bottom</Button>
        </ButtonGroup>
      </Box>

      <Box>
        <h4>Equal Width</h4>
        <ButtonGroup equalWidth spacing="sm">
          <Button>Short</Button>
          <Button>Medium Length</Button>
          <Button>Very Long Button Text</Button>
        </ButtonGroup>
      </Box>
    </Box>
  ),
};

// Complex Examples
export const ComplexExample: Story = {
  render: () => (
    <Box display="flex" gap={2} flexDirection="column" alignItems="center">
      <Button
        size="large"
        leftIcon={<Download size={20} />}
        loading={false}
        glow
        tooltip="Download the latest version"
        animation={{ type: "pulse", duration: 2000, repeat: true }}
      >
        Download Now
      </Button>

      <Button
        variant="outlined"
        color="success"
        shape="rounded"
        rightIcon={<Plus size={18} />}
        uppercase
        maxWidth="200px"
      >
        Add New Item
      </Button>
    </Box>
  ),
};
