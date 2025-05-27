import { Box, Typography, Button } from "@fin-compass/ui";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        p: 4,
      }}
    >
      <Typography variant="h1" color="text.secondary">
        404
      </Typography>
      <Typography variant="h4">Page Not Found</Typography>
      <Typography variant="body1" color="text.secondary" align="center">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
