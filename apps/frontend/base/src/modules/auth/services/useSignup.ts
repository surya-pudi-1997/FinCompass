import { useApiCall } from "../../../hooks/useApiCall";
import { useAuthStore } from "../../../store/useAuthStore";
import { CreateUserInput } from "@fin-compass/types";
import { useNavigate } from "react-router-dom";

interface SignupResponse {
  data: {
    user: {
      id: string;
      email: string;
      fullName: string;
      preferredCurrency: string;
      networth: number | null;
      createdAt: string;
      updatedAt: string;
      isActive: boolean;
      lastLogin: string;
    };
    token: string;
  };
}

export const useSignup = () => {
  const { apiRequestController } = useApiCall();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setSignupError = useAuthStore((state) => state.setSignupError);
  const clearSignupError = useAuthStore((state) => state.clearErrors);
  const navigate = useNavigate();

  const defaultFallback = () => {
    setSignupError("An error occurred during signup");
  };

  const statusHandlers = [
    {
      status_code: 201,
      status_txt: "Signup successful",
      callback: (response: SignupResponse) => {
        const user = response.data.user;
        const token = response.data.token;
        setAuth(user, token);
        navigate("/login"); // Redirect to login page after successful signup
      },
    },
    {
      status_code: 400,
      status_txt: "Validation error",
      callback: () => {
        setSignupError("Invalid signup details");
      },
    },
    {
      status_code: 409,
      status_txt: "Conflict",
      callback: () => {
        setSignupError("Email already exists");
      },
    },
  ];

  const callSignup = (body: CreateUserInput) => {
    const apiConfig = {
      method: "POST",
      url: "/api/user/signup",
      payload: body,
    };
    const externalStatusHandlers = {
      statusHandlers,
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback,
    };
    clearSignupError();
    apiRequestController({ apiConfig, externalStatusHandlers });
  };

  return { callSignup };
};
