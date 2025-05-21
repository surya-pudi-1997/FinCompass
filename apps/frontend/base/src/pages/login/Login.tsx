import { useState } from "react";
import { Box, Typography, Button } from "@fin-compass/ui";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login with:", { email, password });
  };

  return (
    <Box
      onSubmit={handleLogin}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        p: 4,
      }}
    >
      <Typography variant="h4" mb={4}>
        Login to FinCompass
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Box
              component="span"
              sx={{ color: "primary.main", cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
