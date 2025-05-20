import { useState } from "react";
import { Box, Typography, Button } from "@fin-compass/ui";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log("Signup with:", {
      email,
      password,
      fullName,
      preferredCurrency,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSignup}
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
        Create your FinCompass Account
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
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
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
        <select
          value={preferredCurrency}
          onChange={(e) => setPreferredCurrency(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR">INR</option>
        </select>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Sign Up
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Box
              component="span"
              sx={{ color: "primary.main", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
