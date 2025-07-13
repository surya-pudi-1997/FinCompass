import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useUserStore } from "@/shared/stores";
import { CreateUserInput, UserResponse } from "@fin-compass/types";
import { useNavigate } from "react-router";
import { routes } from "@/router/routes";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: T;
}

const useRegisterService = () => {
  const { setLoginError, setLoginLoading } = useUserStore();
  const navigate = useNavigate();

  const {
    apiResponse,
    apiLoading,
    apiError,
    apiRequestController,
    cancelAPIRequest,
  } = useApiRequest<ApiResponse<UserResponse>>(
    { cancelAPIOnUnmount: true },
    { loaderAction: setLoginLoading }
  );

  const register = (userData: CreateUserInput) => {
    const apiConfig = {
      method: API_METHODS.POST,
      url: API_ENDPOINTS.REGISTER,
      payload: userData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 201,
          status_txt: "User created successfully",
          callback: (response: ApiResponse<UserResponse>) => {
            console.log("Registration successful:", response);
            // After successful registration, navigate to login page
            setLoginError(null);
            navigate(routes.LOGIN);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<UserResponse>) => {
            console.error("Registration validation error:", response);
            setLoginError(
              "Please check your registration details and try again."
            );
          },
        },
        {
          status_code: 409,
          status_txt: "User already exists",
          callback: (response: ApiResponse<UserResponse>) => {
            console.error("User already exists:", response);
            setLoginError(
              "An account with this email already exists. Please login instead."
            );
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("API request failed:", error);
          setLoginError(
            "An error occurred during registration. Please try again."
          );
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
    register,
    apiResponse,
    apiLoading,
    apiError,
    cancelAPIRequest,
  };
};

export default useRegisterService;
