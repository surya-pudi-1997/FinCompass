import { useState } from "react";
import { Box, Typography, Button, Input, Select } from "@fin-compass/ui";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../services/useSignup";
import { encrypt } from "@fin-compass/utils";
import { ENCRYPTION_KEY } from "../../../constants";
import { useAuthValidations } from "../validations/useAuthValidations";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");
  const {
    emailError,
    passwordError,
    fullNameError,
    validateEmail,
    validateSignupPassword,
    validateFullName,
  } = useAuthValidations();
  const { callSignup } = useSignup();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validateSignupPassword(password);
    const isFullNameValid = validateFullName(fullName);

    if (isEmailValid && isPasswordValid && isFullNameValid) {
      const encryptedPassword = encrypt(password, ENCRYPTION_KEY);
      callSignup({
        email,
        password: encryptedPassword,
        fullName,
        preferredCurrency,
      });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSignup}
      variant="vertical-centered"
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" mb={4} textAlign={"center"}>
        Create your FinCompass Account
      </Typography>
      <Box
        variant="vertical-centered-full-width"
        sx={{
          maxWidth: {
            xs: "310px",
            sm: "400px",
            md: "500px",
          },
        }}
      >
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fullNameError) validateFullName(e.target.value);
          }}
          error={Boolean(fullNameError)}
          errorMessage={fullNameError}
          showBottomMargin
        />
        <Input
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) validateSignupPassword(e.target.value);
          }}
          error={Boolean(passwordError)}
          errorMessage={passwordError}
          showBottomMargin
        />{" "}
        <Select
          label="Preferred Currency"
          placeholder="Select Currency"
          value={preferredCurrency}
          onChange={(e) => setPreferredCurrency(e.target.value)}
          options={[
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
            { value: "INR", label: "INR" },
          ]}
          showBottomMargin
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Sign Up
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Box
              as="span"
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
