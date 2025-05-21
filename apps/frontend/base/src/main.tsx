import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@fin-compass/ui";
import { Router } from "./router/router";

const App = () => (
  <ThemeProvider>
    <Router />
  </ThemeProvider>
);

createRoot(document.getElementById("app")!).render(<App />);
