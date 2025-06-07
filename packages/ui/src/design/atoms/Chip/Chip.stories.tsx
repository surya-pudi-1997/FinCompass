import type { Meta, StoryObj } from "@storybook/react";
import { Chip, ChipGroup } from "./Chip";
import { ChipProps, ChipGroupProps } from "./Chip.types";
import { Box } from "../Box";

const meta: Meta<typeof Chip> = {
  title: "Design System/Atoms/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    status: {
      control: { type: "select" },
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info",
      ],
    },
    variant: {
      control: { type: "select" },
      options: ["filled", "outlined", "soft", "ghost", "gradient"],
    },
    shape: {
      control: { type: "select" },
      options: ["rounded", "square", "circular"],
    },
    leftIcon: {
      control: false,
    },
    rightIcon: {
      control: false,
    },
    avatar: {
      control: false,
    },
    gradient: {
      control: false,
    },
    badge: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<ChipProps>;

// Basic Examples
export const Default: Story = {
  args: {
    children: "Default Chip",
  },
};

export const BasicVariants: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip variant="filled">Filled</Chip>
      <Chip variant="outlined">Outlined</Chip>
      <Chip variant="soft">Soft</Chip>
      <Chip variant="ghost">Ghost</Chip>
      <Chip variant="gradient">Gradient</Chip>
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap="sm" alignItems="center">
      <Chip size="small">Small</Chip>
      <Chip size="medium">Medium</Chip>
      <Chip size="large">Large</Chip>
    </Box>
  ),
};

export const StatusColors: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip status="default">Default</Chip>
      <Chip status="primary">Primary</Chip>
      <Chip status="secondary">Secondary</Chip>
      <Chip status="success">Success</Chip>
      <Chip status="warning">Warning</Chip>
      <Chip status="error">Error</Chip>
      <Chip status="info">Info</Chip>
    </Box>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Box display="flex" gap="sm" alignItems="center">
      <Chip shape="rounded">Rounded</Chip>
      <Chip shape="square">Square</Chip>
      <Chip shape="circular">Circular</Chip>
    </Box>
  ),
};

// Interactive Examples
export const WithIcons: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip leftIcon={<span>👤</span>}>User</Chip>
      <Chip
        rightIcon={<span>✕</span>}
        deletable
        onDelete={() => alert("Deleted!")}
      >
        Deletable
      </Chip>
      <Chip leftIcon={<span>⭐</span>} rightIcon={<span>✕</span>} deletable>
        With Both Icons
      </Chip>
    </Box>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip
        avatar={
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#1976d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
            }}
          >
            JD
          </div>
        }
      >
        John Doe
      </Chip>
      <Chip
        avatar={
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#388e3c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
            }}
          >
            SM
          </div>
        }
      >
        Sarah Miller
      </Chip>
    </Box>
  ),
};

export const ClickableChips: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip clickable onClick={() => alert("Chip clicked!")}>
        Clickable
      </Chip>
      <Chip
        selectable
        onSelectionChange={(selected) =>
          console.log("Selection changed:", selected)
        }
      >
        Selectable
      </Chip>
      <Chip clickable tooltip="This chip has a tooltip">
        With Tooltip
      </Chip>
    </Box>
  ),
};

// Advanced Features
export const LoadingStates: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip loading>Loading...</Chip>
      <Chip loading loadingText="Processing">
        Custom Loading Text
      </Chip>
      <Chip loading size="small">
        Small Loading
      </Chip>
    </Box>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip badge={{ content: 5, color: "error" }}>Messages</Chip>
      <Chip badge={{ content: "NEW", color: "success", variant: "standard" }}>
        Feature
      </Chip>
      <Chip badge={{ content: 99, color: "warning", max: 99 }}>
        Notifications
      </Chip>
    </Box>
  ),
};

export const AnimatedChips: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip pulse status="info">
        Pulsing
      </Chip>
      <Chip bounce status="success">
        Bouncing (hover me)
      </Chip>
      <Chip glow status="warning">
        Glowing
      </Chip>
    </Box>
  ),
};

export const GradientChips: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip variant="gradient">Default Gradient</Chip>
      <Chip variant="gradient" gradient={{ start: "#ff6b6b", end: "#feca57" }}>
        Custom Gradient
      </Chip>
      <Chip
        variant="gradient"
        gradient={{ start: "#5f27cd", end: "#341f97", direction: "to bottom" }}
      >
        Vertical Gradient
      </Chip>
    </Box>
  ),
};

export const TruncatedChips: Story = {
  render: () => (
    <Box
      display="flex"
      flexDirection="column"
      gap="sm"
      style={{ width: "300px" }}
    >
      <Chip maxWidth="150px" truncate>
        This is a very long chip text that will be truncated
      </Chip>
      <Chip
        maxWidth="200px"
        truncate
        tooltip="This is a very long chip text that will be truncated with tooltip"
      >
        This is a very long chip text that will be truncated with tooltip
      </Chip>
    </Box>
  ),
};

export const DraggableChips: Story = {
  render: () => (
    <Box display="flex" gap="sm" flexWrap="wrap">
      <Chip
        draggable
        onDragStart={(e) => console.log("Drag start", e)}
        onDragEnd={(e) => console.log("Drag end", e)}
      >
        Drag me
      </Chip>
      <Chip draggable status="primary" leftIcon={<span>📁</span>}>
        File.pdf
      </Chip>
    </Box>
  ),
};

// Chip Group Examples
export const BasicChipGroup: StoryObj<ChipGroupProps> = {
  render: () => (
    <ChipGroup
      label="Select Categories"
      multiSelect={true}
      options={[
        { value: "tech", label: "Technology" },
        { value: "design", label: "Design" },
        { value: "business", label: "Business" },
        { value: "marketing", label: "Marketing" },
        { value: "finance", label: "Finance" },
      ]}
      onChange={(values) => console.log("Selected:", values)}
    />
  ),
};

export const SingleSelectGroup: StoryObj<ChipGroupProps> = {
  render: () => (
    <ChipGroup
      label="Choose Priority"
      multiSelect={false}
      options={[
        { value: "low", label: "Low", color: "success" },
        { value: "medium", label: "Medium", color: "warning" },
        { value: "high", label: "High", color: "error" },
        { value: "critical", label: "Critical", color: "error" },
      ]}
      onSingleChange={(value) => console.log("Selected:", value)}
    />
  ),
};

export const ChipGroupWithIcons: StoryObj<ChipGroupProps> = {
  render: () => (
    <ChipGroup
      label="Select Features"
      multiSelect={true}
      showSelectAll={true}
      showClearAll={true}
      options={[
        { value: "analytics", label: "Analytics", icon: <span>📊</span> },
        { value: "security", label: "Security", icon: <span>🔒</span> },
        { value: "backup", label: "Backup", icon: <span>💾</span> },
        { value: "sync", label: "Sync", icon: <span>🔄</span> },
        { value: "ai", label: "AI Features", icon: <span>🤖</span> },
      ]}
      size="medium"
      variant="outlined"
      onChange={(values) => console.log("Selected features:", values)}
    />
  ),
};

export const ChipGroupWithLimits: StoryObj<ChipGroupProps> = {
  render: () => (
    <ChipGroup
      label="Select up to 3 skills"
      multiSelect={true}
      maxSelections={3}
      options={[
        { value: "js", label: "JavaScript" },
        { value: "ts", label: "TypeScript" },
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "angular", label: "Angular" },
        { value: "node", label: "Node.js" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
      ]}
      onChange={(values) => console.log("Selected skills:", values)}
    />
  ),
};

export const DisabledChipGroup: StoryObj<ChipGroupProps> = {
  render: () => (
    <ChipGroup
      label="Disabled Group"
      disabled={true}
      multiSelect={true}
      options={[
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3", disabled: true },
      ]}
    />
  ),
};

export const VerticalChipGroup: StoryObj<ChipGroupProps> = {
  render: () => (
    <ChipGroup
      label="Vertical Layout"
      direction="column"
      multiSelect={true}
      options={[
        { value: "morning", label: "Morning (6AM - 12PM)" },
        { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
        { value: "evening", label: "Evening (6PM - 10PM)" },
        { value: "night", label: "Night (10PM - 6AM)" },
      ]}
      onChange={(values) => console.log("Selected times:", values)}
    />
  ),
};

// Complex Examples
export const ComprehensiveExample: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="lg" padding="lg">
      <Box>
        <h3 style={{ margin: "0 0 16px 0" }}>Status Variants</h3>
        <Box display="flex" gap="sm" flexWrap="wrap">
          {(["filled", "outlined", "soft", "ghost"] as const).map((variant) => (
            <Box key={variant} display="flex" flexDirection="column" gap="xs">
              <strong>{variant}</strong>
              <Box display="flex" gap="xs" flexWrap="wrap">
                {(["primary", "success", "warning", "error"] as const).map(
                  (status) => (
                    <Chip
                      key={status}
                      variant={variant}
                      status={status}
                      size="small"
                    >
                      {status}
                    </Chip>
                  )
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <h3 style={{ margin: "0 0 16px 0" }}>Interactive Features</h3>
        <Box display="flex" gap="sm" flexWrap="wrap">
          <Chip clickable leftIcon={<span>👤</span>} tooltip="User profile">
            Profile
          </Chip>
          <Chip deletable status="error" onDelete={() => alert("Deleted!")}>
            Delete me
          </Chip>
          <Chip loading size="small">
            Saving...
          </Chip>
          <Chip badge={{ content: 3, color: "error" }} status="primary">
            Inbox
          </Chip>
          <Chip pulse glow status="success">
            Live
          </Chip>
        </Box>
      </Box>

      <Box>
        <h3 style={{ margin: "0 0 16px 0" }}>Chip Groups</h3>
        <ChipGroup
          label="Technologies"
          multiSelect={true}
          showSelectAll={true}
          options={[
            { value: "react", label: "React", icon: <span>⚛️</span> },
            { value: "vue", label: "Vue", icon: <span>💚</span> },
            { value: "angular", label: "Angular", icon: <span>🅰️</span> },
            { value: "svelte", label: "Svelte", icon: <span>🔥</span> },
          ]}
          size="medium"
          variant="soft"
        />
      </Box>
    </Box>
  ),
};
