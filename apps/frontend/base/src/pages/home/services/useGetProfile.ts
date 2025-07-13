import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useUserStore } from "@/shared/stores";
import { UserWithoutPassword } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { user: T };
}

const useGetProfileService = () => {
  const { setProfileError, setProfileLoading, setUser } = useUserStore();

  const {
    apiResponse,
    apiLoading,
    apiError,
    apiRequestController,
    cancelAPIRequest,
  } = useApiRequest<ApiResponse<UserWithoutPassword>>(
    { cancelAPIOnUnmount: true },
    { loaderAction: setProfileLoading }
  );

  const getProfile = () => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: API_ENDPOINTS.GET_PROFILE,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<UserWithoutPassword>) => {
            console.log("Profile fetch successful:", response);
            setUser(response?.data?.user || null);
            setProfileError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "User not found",
          callback: (response: ApiResponse<UserWithoutPassword>) => {
            console.error("User not found:", response);
            setProfileError(
              "No user found with the given id, please check again"
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
          setProfileError("Something went wrong, please try again later");
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
    getProfile,
    apiResponse,
    apiLoading,
    apiError,
    cancelAPIRequest,
  };
};

export default useGetProfileService;
