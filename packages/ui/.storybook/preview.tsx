import type { Preview } from "@storybook/react";
import { Decorator } from "@storybook/react";
import { ThemeProvider } from "../src";
import "../src/index.css";
// This decorator will wrap every story with the ThemeProvider
export const withMuiThemeProvider: Decorator = (Story) => {
  return (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  );
};
// Define decorators and include your custom decorator
export const decorators = [withMuiThemeProvider];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
