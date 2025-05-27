import { useState } from "react";
import { Box, Typography, Button, Input } from "@fin-compass/ui";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../services/useLogin";
import { encrypt } from "@fin-compass/utils";
import { ENCRYPTION_KEY } from "../../../constants";
import { useAuthValidations } from "../validations/useAuthValidations";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { emailError, passwordError, validateEmail, validatePassword } =
    useAuthValidations();
  const { callLogin } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      const encryptedPassword = encrypt(password, ENCRYPTION_KEY);
      callLogin({ email, password: encryptedPassword });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleLogin}
      variant="vertical-centered"
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" mb={4} textAlign={"center"}>
        Login to FinCompass
      </Typography>
      <Box
        variant="vertical-centered-full-width"
        sx={{
          maxWidth: {
            xs: "310px",
            sm: "420px",
            md: "500px",
          },
        }}
      >
        <Input
          fullWidth
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) validateEmail(e.target.value);
          }}
          error={Boolean(emailError)}
          errorMessage={emailError}
          showBottomMargin
        />
        <Input
          fullWidth
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) validatePassword(e.target.value);
          }}
          error={Boolean(passwordError)}
          errorMessage={passwordError}
          showBottomMargin
        />
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
