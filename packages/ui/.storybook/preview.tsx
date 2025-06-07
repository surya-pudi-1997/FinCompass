import type { Preview } from "@storybook/react";
import { Decorator } from "@storybook/react";
import { ThemeProvider } from "../src";
import { Box } from "../src";

import { themes } from "@storybook/theming";

import "../src/index.css";

export const withMuiThemeProvider: Decorator = (Story) => {
  return (
    <ThemeProvider>
      <Box
        sx={{
          "&.sb-show-main.sb-main-centered #storybook-root": {
            backgroundColor: "#181a1c",
          },
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <Story />
      </Box>
    </ThemeProvider>
  );
};
// Define decorators and include your custom decorator
export const decorators = [withMuiThemeProvider];

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#181a1c",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
    docs: {
      theme: themes.dark,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  initialGlobals: {
    backgrounds: { value: "#1e1f26" },
  },
};

export default preview;
