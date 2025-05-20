import { Box } from "@fin-compass/ui";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        bgcolor: "background.default",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default Layout;
