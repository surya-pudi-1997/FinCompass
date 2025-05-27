import { useState } from "react";

export const useAuthValidations = () => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");

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

  const validateSignupPassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setPasswordError(
        `Password must be at least ${minLength} characters long`
      );
      return false;
    }
    if (!hasUpperCase) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!hasLowerCase) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!hasNumber) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const validateFullName = (name: string) => {
    if (!name) {
      setFullNameError("Full name is required");
      return false;
    }
    if (name.length < 2) {
      setFullNameError("Full name must be at least 2 characters");
      return false;
    }
    setFullNameError("");
    return true;
  };

  return {
    emailError,
    passwordError,
    fullNameError,
    validateEmail,
    validatePassword,
    validateSignupPassword,
    validateFullName,
  };
};
