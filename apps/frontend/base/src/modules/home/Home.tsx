import { useAuthStore } from "../../store/useAuthStore";
import { Box, Typography, Button } from "@fin-compass/ui";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const store = useAuthStore((state) => state);
  console.log("Store state:", store);

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate("/");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="outlined" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" color="primary">
          Welcome to your FinCompass Dashboard
        </Typography>
        {/* TODO: Add dashboard content */}
      </Box>
    </Box>
  );
};

export default Home;
