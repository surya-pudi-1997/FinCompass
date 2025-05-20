import { ThemeProvider as MThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { ReactNode } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../index.css";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <MThemeProvider theme={theme}>{children}</MThemeProvider>;
};

export default ThemeProvider;
