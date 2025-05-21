import { useState } from "react";
import { Box, Typography, Button } from "@fin-compass/ui";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./services/useLogin";
import { encrypt } from "@fin-compass/utils";
import { ENCRYPTION_KEY } from "../../constants";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { callLogin } = useLogin();

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    setPasswordError("");
    return true;
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      // Encrypt password before sending to API
      const encryptedPassword = encrypt(password, ENCRYPTION_KEY);
      callLogin({ email, password: encryptedPassword });
    }
  };

  return (
    <Box
      as="form"
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
        <Box>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "4px",
              border: `1px solid ${emailError ? "#ff0000" : "#ccc"}`,
              width: "100%",
            }}
          />
          {emailError && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 0.5, display: "block" }}
            >
              {emailError}
            </Typography>
          )}
        </Box>
        <Box>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) validatePassword(e.target.value);
            }}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "4px",
              border: `1px solid ${passwordError ? "#ff0000" : "#ccc"}`,
              width: "100%",
            }}
          />
          {passwordError && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 0.5, display: "block" }}
            >
              {passwordError}
            </Typography>
          )}
        </Box>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Box
              as="span"
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
