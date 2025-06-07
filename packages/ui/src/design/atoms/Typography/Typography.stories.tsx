import type { Meta, StoryObj } from "@storybook/react";
import { Box, Stack } from "@mui/material";

import { Typography } from "./Typography";
import { TypographyProps } from "./Typography.types";

const meta = {
  title: "Design System/Atoms/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Enhanced Typography component with advanced features including gradients, animations, text effects, and accessibility support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "body1",
        "body2",
        "caption",
        "subtitle1",
        "subtitle2",
      ],
      description: "MUI Typography variant",
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "base",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
      ],
      description: "Custom size system",
    },
    weight: {
      control: "select",
      options: [
        "thin",
        "light",
        "normal",
        "medium",
        "semibold",
        "bold",
        "extrabold",
        "black",
      ],
      description: "Font weight",
    },
    textAlign: {
      control: "select",
      options: ["left", "center", "right", "justify", "start", "end"],
      description: "Text alignment",
    },
    textTransform: {
      control: "select",
      options: ["none", "uppercase", "lowercase", "capitalize"],
      description: "Text transformation",
    },
    letterSpacing: {
      control: "select",
      options: ["tight", "normal", "wide", "wider", "widest"],
      description: "Letter spacing",
    },
    lineHeight: {
      control: "select",
      options: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      description: "Line height",
    },
    textShadow: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Text shadow",
    },
    hoverEffect: {
      control: "select",
      options: [
        "none",
        "fade",
        "glow",
        "scale",
        "color-shift",
        "underline-grow",
      ],
      description: "Hover effects",
    },
    contrast: {
      control: "select",
      options: ["low", "normal", "high", "auto"],
      description: "Text contrast",
    },
    decoration: {
      control: "select",
      options: ["none", "underline", "line-through", "overline"],
      description: "Text decoration",
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "disabled"],
      description: "Text color",
    },
    ellipsis: {
      control: "boolean",
      description: "Enable text truncation",
    },
    selectable: {
      control: "boolean",
      description: "Allow text selection",
    },
    responsive: {
      control: "boolean",
      description: "Enable responsive font sizing",
    },
    readingGuide: {
      control: "boolean",
      description: "Add reading guide for accessibility",
    },
    loading: {
      control: "boolean",
      description: "Show loading skeleton",
    },
  },
} satisfies Meta<TypographyProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Typography
export const Default: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "body1",
  },
};

// Typography Variants
export const Variants: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%", maxWidth: 600 }}>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
      <Typography variant="subtitle1">Subtitle 1</Typography>
      <Typography variant="subtitle2">Subtitle 2</Typography>
      <Typography variant="body1">Body 1 - Regular paragraph text</Typography>
      <Typography variant="body2">Body 2 - Smaller paragraph text</Typography>
      <Typography variant="caption">Caption text</Typography>
    </Stack>
  ),
};

// Font Weights
export const FontWeights: Story = {
  render: () => (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Typography weight="thin">Thin Weight (100)</Typography>
      <Typography weight="light">Light Weight (300)</Typography>
      <Typography weight="normal">Normal Weight (400)</Typography>
      <Typography weight="medium">Medium Weight (500)</Typography>
      <Typography weight="semibold">Semibold Weight (600)</Typography>
      <Typography weight="bold">Bold Weight (700)</Typography>
      <Typography weight="extrabold">Extrabold Weight (800)</Typography>
      <Typography weight="black">Black Weight (900)</Typography>
    </Stack>
  ),
};

// Custom Sizes
export const CustomSizes: Story = {
  render: () => (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Typography size="xs">Extra Small (0.75rem)</Typography>
      <Typography size="sm">Small (0.875rem)</Typography>
      <Typography size="base">Base (1rem)</Typography>
      <Typography size="lg">Large (1.125rem)</Typography>
      <Typography size="xl">Extra Large (1.25rem)</Typography>
      <Typography size="2xl">2X Large (1.5rem)</Typography>
      <Typography size="3xl">3X Large (1.875rem)</Typography>
      <Typography size="4xl">4X Large (2.25rem)</Typography>
      <Typography size="5xl">5X Large (3rem)</Typography>
      <Typography size="6xl">6X Large (3.75rem)</Typography>
    </Stack>
  ),
};

// Text Alignment
export const TextAlignment: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography textAlign="left">Left aligned text</Typography>
      <Typography textAlign="center">Center aligned text</Typography>
      <Typography textAlign="right">Right aligned text</Typography>
      <Typography textAlign="justify">
        Justified text that will be evenly distributed across the line when
        there is enough content to wrap to multiple lines.
      </Typography>
    </Stack>
  ),
};

// Text Transform and Decoration
export const TextStyling: Story = {
  render: () => (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Typography textTransform="uppercase">Uppercase Text</Typography>
      <Typography textTransform="lowercase">LOWERCASE TEXT</Typography>
      <Typography textTransform="capitalize">capitalize each word</Typography>
      <Typography decoration="underline">Underlined text</Typography>
      <Typography decoration="line-through">Strikethrough text</Typography>
      <Typography decoration="overline">Overlined text</Typography>
    </Stack>
  ),
};

// Letter Spacing and Line Height
export const Spacing: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Box>
        <Typography variant="h6">Letter Spacing</Typography>
        <Typography letterSpacing="tight">Tight letter spacing</Typography>
        <Typography letterSpacing="normal">Normal letter spacing</Typography>
        <Typography letterSpacing="wide">Wide letter spacing</Typography>
        <Typography letterSpacing="wider">Wider letter spacing</Typography>
        <Typography letterSpacing="widest">Widest letter spacing</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Line Height</Typography>
        <Typography lineHeight="tight">
          Tight line height. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt.
        </Typography>
        <Typography lineHeight="normal">
          Normal line height. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt.
        </Typography>
        <Typography lineHeight="relaxed">
          Relaxed line height. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Sed do eiusmod tempor incididunt.
        </Typography>
        <Typography lineHeight="loose">
          Loose line height. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt.
        </Typography>
      </Box>
    </Stack>
  ),
};

// Gradients
export const GradientText: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        gradient={{ from: "#ff6b6b", to: "#4ecdc4" }}
        weight="bold"
      >
        Gradient Text (Left to Right)
      </Typography>
      <Typography
        variant="h4"
        gradient={{ from: "#667eea", to: "#764ba2", direction: "to-b" }}
        weight="bold"
      >
        Gradient Text (Top to Bottom)
      </Typography>
      <Typography
        variant="h4"
        gradient={{ from: "#f093fb", to: "#f5576c", direction: "to-br" }}
        weight="bold"
      >
        Gradient Text (Diagonal)
      </Typography>
      <Typography
        variant="h4"
        gradient={{ from: "#4facfe", to: "#00f2fe", direction: "to-tr" }}
        weight="bold"
      >
        Ocean Gradient
      </Typography>
    </Stack>
  ),
};

// Text Shadows
export const TextShadows: Story = {
  render: () => (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Typography textShadow="sm" size="lg">
        Small text shadow
      </Typography>
      <Typography textShadow="md" size="lg">
        Medium text shadow
      </Typography>
      <Typography textShadow="lg" size="lg">
        Large text shadow
      </Typography>
      <Typography textShadow="xl" size="lg">
        Extra large text shadow
      </Typography>
    </Stack>
  ),
};

// Hover Effects
export const HoverEffects: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography hoverEffect="fade" sx={{ cursor: "pointer" }}>
        Hover for fade effect
      </Typography>
      <Typography hoverEffect="glow" sx={{ cursor: "pointer" }}>
        Hover for glow effect
      </Typography>
      <Typography hoverEffect="scale" sx={{ cursor: "pointer" }}>
        Hover for scale effect
      </Typography>
      <Typography hoverEffect="color-shift" sx={{ cursor: "pointer" }}>
        Hover for color shift
      </Typography>
      <Typography hoverEffect="underline-grow" sx={{ cursor: "pointer" }}>
        Hover for growing underline
      </Typography>
    </Stack>
  ),
};

// Animations
export const Animations: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography animation={{ type: "fade-in", duration: 1 }} variant="h5">
        Fade In Animation
      </Typography>
      <Typography animation={{ type: "slide-in", duration: 0.8 }} variant="h5">
        Slide In Animation
      </Typography>
      <Typography animation={{ type: "bounce", duration: 1 }} variant="h5">
        Bounce Animation
      </Typography>
      <Typography
        animation={{ type: "glow-pulse", duration: 2, repeat: true }}
        variant="h5"
      >
        Glow Pulse (Repeating)
      </Typography>
    </Stack>
  ),
};

// Text Truncation
export const TextTruncation: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Box>
        <Typography variant="h6">Single Line Truncation</Typography>
        <Typography ellipsis>
          This is a very long text that will be truncated with ellipsis when it
          exceeds the container width.
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6">Multi-line Truncation</Typography>
        <Typography ellipsis maxLines={3}>
          This is a much longer text that demonstrates multi-line truncation. It
          will show up to three lines before being truncated with ellipsis.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
      </Box>
    </Stack>
  ),
};

// Text Highlighting
export const TextHighlighting: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography
        highlight={{
          enabled: true,
          searchTerms: ["important", "highlight"],
          backgroundColor: "#ffeb3b",
        }}
      >
        This text contains some important words that will be highlighted
        automatically.
      </Typography>
      <Typography
        highlight={{
          enabled: true,
          searchTerms: ["custom", "color"],
          backgroundColor: "#f8bbd9",
        }}
      >
        You can also use custom color for highlighting specific terms in your
        text.
      </Typography>
    </Stack>
  ),
};

// Loading States
export const LoadingStates: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 400 }}>
      <Box>
        <Typography variant="h6">Single Line Loading</Typography>
        <Typography loading skeletonLines={1} />
      </Box>
      <Box>
        <Typography variant="h6">Multi-line Loading</Typography>
        <Typography loading skeletonLines={3} />
      </Box>
      <Box>
        <Typography variant="h6">Custom Size Loading</Typography>
        <Typography loading skeletonLines={2} size="lg" />
      </Box>
    </Stack>
  ),
};

// Accessibility Features
export const AccessibilityFeatures: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography readingGuide tabIndex={0} sx={{ cursor: "pointer" }}>
        Click or tab to this text to see the reading guide (focus outline)
      </Typography>
      <Typography accessibility={{ announceChanges: true }} role="status">
        This text will announce changes to screen readers
      </Typography>
      <Typography
        accessibility={{ describedBy: "helper-text" }}
        aria-describedby="helper-text"
      >
        This text has additional description
      </Typography>
      <Typography id="helper-text" variant="caption" color="secondary">
        This is the helper text that describes the above content
      </Typography>
    </Stack>
  ),
};

// Contrast and Responsiveness
export const ResponsiveAndContrast: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography responsive variant="h4">
        Responsive text that scales with viewport (resize to see effect)
      </Typography>
      <Typography contrast="low">Low contrast text</Typography>
      <Typography contrast="normal">Normal contrast text</Typography>
      <Typography contrast="high">High contrast text</Typography>
    </Stack>
  ),
};

// Complex Example
export const ComplexExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 600, p: 3 }}>
      <Typography
        variant="h3"
        gradient={{ from: "#667eea", to: "#764ba2" }}
        textAlign="center"
        weight="bold"
        animation={{ type: "fade-in", duration: 1 }}
        sx={{ mb: 3 }}
      >
        Typography Showcase
      </Typography>

      <Typography
        variant="h5"
        weight="semibold"
        textShadow="sm"
        hoverEffect="glow"
        sx={{ mb: 2, cursor: "pointer" }}
      >
        Interactive Heading with Glow Effect
      </Typography>

      <Typography
        variant="body1"
        lineHeight="relaxed"
        letterSpacing="wide"
        sx={{ mb: 2 }}
      >
        This paragraph demonstrates advanced typography features including
        custom line height and letter spacing for improved readability.
      </Typography>

      <Typography
        variant="body2"
        ellipsis
        maxLines={2}
        sx={{ mb: 2, width: 300 }}
      >
        This text is truncated after two lines and shows how the ellipsis
        feature works with longer content that would normally wrap to multiple
        lines.
      </Typography>

      <Typography
        size="lg"
        weight="medium"
        decoration="underline"
        hoverEffect="color-shift"
        sx={{ cursor: "pointer" }}
      >
        Link-style text with hover color change
      </Typography>
    </Box>
  ),
};

// All Features Showcase
export const AllFeatures: Story = {
  render: () => (
    <Box sx={{ maxWidth: 800, p: 4 }}>
      <Typography
        variant="h2"
        gradient={{ from: "#ff6b6b", to: "#4ecdc4" }}
        textAlign="center"
        weight="bold"
        animation={{ type: "slide-in", duration: 1 }}
        sx={{ mb: 4 }}
      >
        Complete Typography System
      </Typography>

      <Stack spacing={3}>
        {/* Sizes Demo */}
        <Box>
          <Typography variant="h5" weight="semibold" sx={{ mb: 1 }}>
            Size System
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {["xs", "sm", "base", "lg", "xl"].map((size) => (
              <Typography key={size} size={size as any}>
                {size}
              </Typography>
            ))}
          </Stack>
        </Box>

        {/* Effects Demo */}
        <Box>
          <Typography variant="h5" weight="semibold" sx={{ mb: 1 }}>
            Interactive Effects
          </Typography>
          <Stack spacing={1}>
            <Typography hoverEffect="fade" sx={{ cursor: "pointer" }}>
              Fade on hover
            </Typography>
            <Typography hoverEffect="scale" sx={{ cursor: "pointer" }}>
              Scale on hover
            </Typography>
            <Typography hoverEffect="underline-grow" sx={{ cursor: "pointer" }}>
              Growing underline
            </Typography>
          </Stack>
        </Box>

        {/* Gradients Demo */}
        <Box>
          <Typography variant="h5" weight="semibold" sx={{ mb: 1 }}>
            Gradient Texts
          </Typography>
          <Stack spacing={1}>
            <Typography
              gradient={{ from: "#f093fb", to: "#f5576c" }}
              weight="bold"
            >
              Pink Gradient
            </Typography>
            <Typography
              gradient={{ from: "#4facfe", to: "#00f2fe" }}
              weight="bold"
            >
              Blue Gradient
            </Typography>
          </Stack>
        </Box>

        {/* Animated Demo */}
        <Box>
          <Typography variant="h5" weight="semibold" sx={{ mb: 1 }}>
            Animations
          </Typography>
          <Typography
            animation={{ type: "glow-pulse", duration: 2, repeat: true }}
            gradient={{ from: "#667eea", to: "#764ba2" }}
            weight="bold"
          >
            Pulsing glow effect
          </Typography>
        </Box>
      </Stack>
    </Box>
  ),
};
