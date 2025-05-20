import { createTheme } from "@mui/material/styles"; // 41.5k (gzipped: 13.5k)

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#181a1c",
      paper: "#1e1f26",
    },
    primary: {
      main: "#1fe4b0",
    },
    secondary: {
      main: "#0055b2",
    },
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
  },
  typography: {
    h1: {
      fontSize: "var(--font-size-h1)",
    },
    h2: {
      fontSize: "var(--font-size-h2)",
    },
    h3: {
      fontSize: "var(--font-size-h3)",
    },
    h4: {
      fontSize: "var(--font-size-h4)",
    },
    h5: {
      fontSize: "var(--font-size-h5)",
    },
    h6: {
      fontSize: "var(--font-size-h6)",
    },
    subtitle1: {
      fontSize: "var(--font-size-p)",
    },
    subtitle2: {
      fontSize: "var(--font-size--1)",
    },
    body1: {
      fontSize: "var(--font-size-p)",
    },
    body2: {
      fontSize: "var(--font-size--1)",
    },
    button: {
      fontSize: "var(--font-size--1)",
    },
    caption: {
      fontSize: "var(--font-size--2)",
    },
    overline: {
      fontSize: "var(--font-size--3)",
    },
  },
  spacing: [
    "var(--space-3xs)",
    "var(--space-2xs)",
    "var(--space-xs)",
    "var(--space-s)",
    "var(--space-m)",
    "var(--space-l)",
    "var(--space-xl)",
    "var(--space-2xl)",
    "var(--space-3xl)",
  ],
});

export default theme;
