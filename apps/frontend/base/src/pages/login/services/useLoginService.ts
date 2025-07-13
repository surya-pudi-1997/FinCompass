import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useUserStore } from "@/shared/stores";
import { LoginResponse } from "@fin-compass/types";
import { useNavigate } from "react-router";
import { routes } from "@/router/routes";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: T;
}

const useLoginService = () => {
  const { setLoginError, setLoginLoading, setToken } = useUserStore();
  const navigate = useNavigate();

  const {
    apiResponse,
    apiLoading,
    apiError,
    apiRequestController,
    cancelAPIRequest,
  } = useApiRequest<ApiResponse<LoginResponse>>(
    { cancelAPIOnUnmount: true },
    { loaderAction: setLoginLoading }
  );

  const login = (email: string, password: string) => {
    const apiConfig = {
      method: API_METHODS.POST,
      url: API_ENDPOINTS.LOGIN,
      payload: { email, password },
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Login successful",
          callback: (response: ApiResponse<LoginResponse>) => {
            console.log("Login successful:", response);
            if (response.data?.token) {
              setToken(response.data.token);
              navigate(routes.HOME);
            }
            setLoginError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation Error",
          callback: (response: ApiResponse<LoginResponse>) => {
            console.error("Invalid credentials:", response);
            setLoginError("Invalid email or password");
          },
        },
      ],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("API request failed:", error);
          setLoginError("An error occurred during login. Please try again.");
        }
      },
    };

    apiRequestController({
      apiConfig,
      externalStatusHandlers,
      additionalAPIRequestHeaders: {
        "Content-Type": "application/json",
      },
    });
  };

  return {
    login,
    apiResponse,
    apiLoading,
    apiError,
    cancelAPIRequest,
  };
};

export default useLoginService;
