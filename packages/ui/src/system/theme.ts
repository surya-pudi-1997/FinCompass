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
});

export default theme;
