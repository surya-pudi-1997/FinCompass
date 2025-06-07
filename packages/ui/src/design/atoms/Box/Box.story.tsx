import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box";
import { BoxProps } from "./Box.types";

const meta: Meta<typeof Box> = {
  title: "Design System/Atoms/Box",
  component: Box,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "flex-fixed",
        "flex-grow",
        "vertical-centered",
        "horizontal-centered",
        "vertical-centered-full-width",
        "horizontal-centered-full-width",
        "card",
        "sidebar",
        "navbar",
        "footer",
        "container",
        "grid-item",
        "scroll-container",
      ],
    },
    padding: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl", "xxl"],
    },
    margin: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl", "xxl"],
    },
    shadow: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl", "inner"],
    },
    rounded: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl", "full"],
    },
    cursor: {
      control: { type: "select" },
      options: [
        "default",
        "pointer",
        "text",
        "move",
        "not-allowed",
        "grab",
        "grabbing",
      ],
    },
    display: {
      control: { type: "select" },
      options: [
        "block",
        "inline",
        "inline-block",
        "flex",
        "inline-flex",
        "grid",
        "none",
      ],
    },
    position: {
      control: { type: "select" },
      options: ["static", "relative", "absolute", "fixed", "sticky"],
    },
    overflow: {
      control: { type: "select" },
      options: ["visible", "hidden", "scroll", "auto"],
    },
    flexDirection: {
      control: { type: "select" },
      options: ["row", "row-reverse", "column", "column-reverse"],
    },
    justifyContent: {
      control: { type: "select" },
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
      ],
    },
    alignItems: {
      control: { type: "select" },
      options: ["stretch", "flex-start", "flex-end", "center", "baseline"],
    },
  },
};

export default meta;
type Story = StoryObj<BoxProps>;

// Basic Examples
export const Default: Story = {
  args: {
    children: "Default Box",
    padding: "md",
  },
};

export const BasicVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box variant="flex-fixed" padding="md" sx={{ border: "1px solid #ccc" }}>
        <span>Left Content</span>
        <span>Right Content</span>
      </Box>
      <Box
        variant="flex-grow"
        padding="md"
        sx={{ border: "1px solid #ccc", height: "60px" }}
      >
        Flex Grow Box
      </Box>
      <Box
        variant="vertical-centered"
        padding="md"
        sx={{ border: "1px solid #ccc", height: "80px" }}
      >
        Vertically Centered
      </Box>
      <Box
        variant="horizontal-centered"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        Horizontally Centered
      </Box>
    </div>
  ),
};

export const LayoutVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box variant="card">
        <h3>Card Variant</h3>
        <p>This box has card styling with shadow and padding.</p>
      </Box>
      <Box variant="navbar">
        <span>Logo</span>
        <nav>Navigation</nav>
        <span>User Menu</span>
      </Box>
      <Box variant="container">
        <p>Container variant with max-width and centered margins.</p>
      </Box>
      <Box variant="footer">
        <p>Footer variant with top border and padding.</p>
      </Box>
    </div>
  ),
};

// Spacing Examples
export const SpacingOptions: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {(["xs", "sm", "md", "lg", "xl", "xxl"] as const).map((spacing) => (
        <Box
          key={spacing}
          padding={spacing}
          sx={{ backgroundColor: "#f0f0f0", border: "1px solid #ccc" }}
        >
          Padding: {spacing}
        </Box>
      ))}
    </div>
  ),
};

export const MarginOptions: Story = {
  render: () => (
    <div style={{ backgroundColor: "#f9f9f9", padding: "16px" }}>
      {(["xs", "sm", "md", "lg", "xl", "xxl"] as const).map((spacing) => (
        <Box
          key={spacing}
          margin={spacing}
          padding="sm"
          sx={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
        >
          Margin: {spacing}
        </Box>
      ))}
    </div>
  ),
};

// Shadow Examples
export const ShadowOptions: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "24px",
        padding: "24px",
      }}
    >
      {(["xs", "sm", "md", "lg", "xl", "inner"] as const).map((shadow) => (
        <Box
          key={shadow}
          shadow={shadow}
          padding="lg"
          sx={{ backgroundColor: "#fff" }}
        >
          Shadow: {shadow}
        </Box>
      ))}
    </div>
  ),
};

// Border Radius Examples
export const RoundingOptions: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
    >
      {(["xs", "sm", "md", "lg", "xl", "full"] as const).map((rounded) => (
        <Box
          key={rounded}
          rounded={rounded}
          padding="lg"
          sx={{ backgroundColor: "#f0f0f0", border: "1px solid #ccc" }}
        >
          Rounded: {rounded}
        </Box>
      ))}
    </div>
  ),
};

// Border Examples
export const BorderOptions: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
      }}
    >
      <Box padding="md" border={{ width: 1, style: "solid", color: "#000" }}>
        Solid Border
      </Box>
      <Box padding="md" border={{ width: 2, style: "dashed", color: "#666" }}>
        Dashed Border
      </Box>
      <Box padding="md" border={{ width: 1, style: "dotted", color: "#999" }}>
        Dotted Border
      </Box>
      <Box padding="md" border={{ width: 3, style: "solid", color: "#ff0000" }}>
        Thick Red Border
      </Box>
    </div>
  ),
};

// Gradient Examples
export const GradientOptions: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
      }}
    >
      <Box
        padding="lg"
        rounded="md"
        gradient={{ start: "#ff7e5f", end: "#feb47b" }}
        sx={{ color: "white", textAlign: "center" }}
      >
        Horizontal Gradient
      </Box>
      <Box
        padding="lg"
        rounded="md"
        gradient={{ start: "#6a11cb", end: "#2575fc", direction: "to bottom" }}
        sx={{ color: "white", textAlign: "center" }}
      >
        Vertical Gradient
      </Box>
      <Box
        padding="lg"
        rounded="md"
        gradient={{
          start: "#f093fb",
          end: "#f5576c",
          direction: "to bottom right",
        }}
        sx={{ color: "white", textAlign: "center" }}
      >
        Diagonal Gradient
      </Box>
      <Box
        padding="lg"
        rounded="md"
        gradient={{ start: "#4facfe", end: "#00f2fe", direction: "to left" }}
        sx={{ color: "white", textAlign: "center" }}
      >
        Reverse Gradient
      </Box>
    </div>
  ),
};

// Interactive Examples
export const InteractiveBoxes: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
      }}
    >
      <Box
        padding="lg"
        rounded="md"
        hover={true}
        cursor="pointer"
        sx={{ backgroundColor: "#f0f0f0", textAlign: "center" }}
        onClick={() => alert("Box clicked!")}
      >
        Hoverable & Clickable
      </Box>
      <Box
        padding="lg"
        rounded="md"
        focusable={true}
        cursor="pointer"
        sx={{ backgroundColor: "#e8f4fd", textAlign: "center" }}
        tabIndex={0}
      >
        Focusable Box (Tab to focus)
      </Box>
      <Box
        padding="lg"
        rounded="md"
        cursor="grab"
        sx={{ backgroundColor: "#fff3cd", textAlign: "center" }}
        onMouseEnter={() => console.log("Mouse entered")}
        onMouseLeave={() => console.log("Mouse left")}
      >
        Grab Cursor with Events
      </Box>
      <Box
        padding="lg"
        rounded="md"
        cursor="not-allowed"
        sx={{ backgroundColor: "#f8d7da", textAlign: "center", opacity: 0.6 }}
      >
        Not Allowed Cursor
      </Box>
    </div>
  ),
};

// Flex Layout Examples
export const FlexLayouts: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        <div>Left</div>
        <div>Center</div>
        <div>Right</div>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="md"
        padding="lg"
        sx={{ border: "1px solid #ccc" }}
      >
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        gap="sm"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <Box
            key={i}
            padding="sm"
            sx={{ backgroundColor: "#f0f0f0", minWidth: "80px" }}
          >
            Item {i + 1}
          </Box>
        ))}
      </Box>
    </div>
  ),
};

// Grid Layout Examples
export const GridLayouts: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="md"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <Box
            key={i}
            padding="md"
            sx={{ backgroundColor: "#f0f0f0", textAlign: "center" }}
          >
            Grid Item {i + 1}
          </Box>
        ))}
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="200px 1fr 100px"
        gridTemplateRows="auto auto"
        gap="sm"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        <Box padding="sm" sx={{ backgroundColor: "#e8f4fd" }}>
          Sidebar
        </Box>
        <Box padding="sm" sx={{ backgroundColor: "#f0f8ff" }}>
          Main Content
        </Box>
        <Box padding="sm" sx={{ backgroundColor: "#fff3cd" }}>
          Aside
        </Box>
        <Box
          gridColumn="1 / -1"
          padding="sm"
          sx={{ backgroundColor: "#f8d7da" }}
        >
          Footer spanning all columns
        </Box>
      </Box>
    </div>
  ),
};

// Positioning Examples
export const PositioningOptions: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        height: "400px",
        border: "1px solid #ccc",
      }}
    >
      {" "}
      <Box
        position="absolute"
        sx={{ top: 0, left: 0, backgroundColor: "#ff6b6b", color: "white" }}
        padding="sm"
        rounded="sm"
        shadow="sm"
      >
        Top Left
      </Box>
      <Box
        position="absolute"
        sx={{ top: 0, right: 0, backgroundColor: "#4ecdc4", color: "white" }}
        padding="sm"
        rounded="sm"
        shadow="sm"
      >
        Top Right
      </Box>
      <Box
        position="absolute"
        sx={{ bottom: 0, left: 0, backgroundColor: "#45b7d1", color: "white" }}
        padding="sm"
        rounded="sm"
        shadow="sm"
      >
        Bottom Left
      </Box>
      <Box
        position="absolute"
        sx={{ bottom: 0, right: 0, backgroundColor: "#f9ca24", color: "black" }}
        padding="sm"
        rounded="sm"
        shadow="sm"
      >
        Bottom Right
      </Box>
      <Box
        position="absolute"
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#6c5ce7",
          color: "white",
        }}
        padding="md"
        rounded="md"
        shadow="md"
      >
        Centered
      </Box>
    </div>
  ),
};

// Overflow Examples
export const OverflowOptions: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
      }}
    >
      <Box
        overflow="hidden"
        maxHeight="80px"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        <div>
          Overflow Hidden: This content is longer than the container and will be
          hidden when it exceeds the max height.
        </div>
      </Box>
      <Box
        overflow="scroll"
        maxHeight="80px"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        <div>
          Overflow Scroll: This content is longer than the container and will
          show scrollbars when it exceeds the max height.
        </div>
      </Box>
      <Box
        overflow="auto"
        maxHeight="80px"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        <div>
          Overflow Auto: This content is longer than the container and will show
          scrollbars only when needed.
        </div>
      </Box>
      <Box
        overflow="visible"
        maxHeight="60px"
        padding="md"
        sx={{ border: "1px solid #ccc" }}
      >
        <div>
          Overflow Visible: This content will extend beyond the container
          boundaries.
        </div>
      </Box>
    </div>
  ),
};

// Animation Examples
export const AnimationOptions: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
      }}
    >
      <Box
        padding="lg"
        rounded="md"
        shadow="md"
        animation={{
          name: "pulse",
          duration: "2s",
          iteration: "infinite",
        }}
        sx={{
          backgroundColor: "#ff6b6b",
          color: "white",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.5 },
          },
        }}
      >
        Pulsing Box
      </Box>
      <Box
        padding="lg"
        rounded="md"
        shadow="md"
        animation={{
          name: "bounce",
          duration: "1s",
          iteration: "infinite",
        }}
        sx={{
          backgroundColor: "#4ecdc4",
          color: "white",
          "@keyframes bounce": {
            "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
            "40%": { transform: "translateY(-10px)" },
            "60%": { transform: "translateY(-5px)" },
          },
        }}
      >
        Bouncing Box
      </Box>
    </div>
  ),
};

// Responsive Examples
export const ResponsiveLayout: Story = {
  render: () => (
    <Box
      responsive={true}
      padding="sm"
      sx={{ border: "1px solid #ccc" }}
      breakpoints={{
        xs: { padding: "xs", rounded: "none" },
        sm: { padding: "sm", rounded: "sm" },
        md: { padding: "md", rounded: "md", shadow: "sm" },
        lg: { padding: "lg", rounded: "lg", shadow: "md" },
        xl: { padding: "xl", rounded: "xl", shadow: "lg" },
      }}
    >
      Responsive Box - Resize the viewport to see changes in padding, rounding,
      and shadow
    </Box>
  ),
};

// Complex Example
export const ComplexLayout: Story = {
  render: () => (
    <Box variant="container">
      <Box variant="card" margin="md">
        <h2 style={{ margin: 0, marginBottom: "16px" }}>Dashboard</h2>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap="md"
          margin="md"
        >
          <Box
            padding="md"
            rounded="md"
            shadow="sm"
            hover={true}
            cursor="pointer"
            gradient={{ start: "#667eea", end: "#764ba2" }}
            sx={{ color: "white", textAlign: "center" }}
          >
            <h3 style={{ margin: 0 }}>Users</h3>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              1,234
            </p>
          </Box>
          <Box
            padding="md"
            rounded="md"
            shadow="sm"
            hover={true}
            cursor="pointer"
            gradient={{ start: "#f093fb", end: "#f5576c" }}
            sx={{ color: "white", textAlign: "center" }}
          >
            <h3 style={{ margin: 0 }}>Revenue</h3>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              $12,345
            </p>
          </Box>
          <Box
            padding="md"
            rounded="md"
            shadow="sm"
            hover={true}
            cursor="pointer"
            gradient={{ start: "#4facfe", end: "#00f2fe" }}
            sx={{ color: "white", textAlign: "center" }}
          >
            <h3 style={{ margin: 0 }}>Orders</h3>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              567
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

// Accessibility Example
export const AccessibilityFeatures: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box
        role="button"
        ariaLabel="Interactive box button"
        focusable={true}
        tabIndex={0}
        padding="md"
        rounded="md"
        cursor="pointer"
        sx={{ backgroundColor: "#f0f0f0", textAlign: "center" }}
        onClick={() => alert("Accessible button clicked!")}
      >
        Accessible Interactive Box (Click me or press Enter when focused)
      </Box>
      <Box
        role="alert"
        ariaLabel="Error message"
        padding="md"
        rounded="md"
        border={{ width: 1, style: "solid", color: "#dc3545" }}
        sx={{ backgroundColor: "#f8d7da", color: "#721c24" }}
      >
        This is an accessible alert box with proper ARIA roles
      </Box>
      <Box
        role="region"
        ariaLabel="Content section"
        ariaDescribedBy="description-text"
        padding="md"
        rounded="md"
        sx={{ backgroundColor: "#d1ecf1", border: "1px solid #bee5eb" }}
      >
        <p>This is a content region with ARIA description</p>
        <p id="description-text" style={{ fontSize: "14px", color: "#0c5460" }}>
          Additional descriptive text for screen readers
        </p>
      </Box>
    </div>
  ),
};
