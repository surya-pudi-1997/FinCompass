import { useApiCall } from "../../../hooks/useApiCall";
import { useUserProfileStore } from "../../../store/useUserProfileStore";
import { UserResponse } from "@fin-compass/types";

interface GetProfileResponse {
  data: {
    user: UserResponse;
  };
}

export const useGetProfile = () => {
  const { apiRequestController } = useApiCall();
  const setUser = useUserProfileStore((state) => state.setUser);
  const setLoading = useUserProfileStore((state) => state.setLoading);
  const setError = useUserProfileStore((state) => state.setError);
  const clearError = useUserProfileStore((state) => state.clearError);

  const defaultFallback = () => {
    setError("An error occurred while fetching user profile");
  };

  const statusHandlers = [
    {
      status_code: 200,
      status_txt: "Success",
      callback: (response: GetProfileResponse) => {
        const user = response.data.user;
        setUser(user);
      },
    },
    {
      status_code: 401,
      status_txt: "Unauthorized",
      callback: () => {
        setError("Unauthorized access. Please login again.");
      },
    },
    {
      status_code: 404,
      status_txt: "Not found",
      callback: () => {
        setError("User profile not found");
      },
    },
    {
      status_code: 500,
      status_txt: "Internal server error",
      callback: () => {
        setError("Server error occurred while fetching user profile");
      },
    },
  ];

  const fetchUserProfile = () => {
    const apiConfig = {
      method: "GET",
      url: "/api/user/fetch",
    };
    const externalStatusHandlers = {
      statusHandlers,
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback,
    };

    setLoading(true);
    clearError();
    apiRequestController({ apiConfig, externalStatusHandlers });
  };

  return { fetchUserProfile };
};
