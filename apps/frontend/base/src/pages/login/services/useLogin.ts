import { useApiCall } from "../../../hooks/useApiCall";
import { useAuthStore } from "../../../store/useAuthStore";
import { LoginInput } from "@fin-compass/types";

interface LoginResponse {
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

export const useLogin = () => {
  const { apiRequestController } = useApiCall();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoginError = useAuthStore((state) => state.setLoginError);
  const clearLoginError = useAuthStore((state) => state.clearErrors);

  const defaultFallback = () => {
    setLoginError("An error occurred during login");
  };

  const statusHandlers = [
    {
      status_code: 200,
      status_txt: "Login successful",
      callback: (response: LoginResponse) => {
        const user = response.data.user;
        const token = response.data.token;
        setAuth(user, token);
      },
    },
    {
      status_code: 400,
      status_txt: "Validation error",
      callback: () => {
        setLoginError("Invalid email or password");
      },
    },
  ];
  const callLogin = (body: LoginInput) => {
    const apiConfig = { method: "POST", url: "/api/user/login", payload: body };
    const externalStatusHandlers = {
      statusHandlers,
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback,
    };
    clearLoginError();
    apiRequestController({ apiConfig, externalStatusHandlers });
  };

  return { callLogin };
};
