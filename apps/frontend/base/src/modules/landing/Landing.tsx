import { Box, Typography, Button } from "@fin-compass/ui";
import { useNavigate } from "react-router-dom";

const Landing = () => {
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
      }}
    >
      <Typography variant="h2" align="center">
        Welcome to FinCompass
      </Typography>
      <Typography variant="h5" align="center">
        Your personal finance management companion
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button variant="outlined" onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Landing;
