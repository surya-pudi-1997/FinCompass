import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useAssetsStore } from "@/shared/stores";
import { Asset } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { assets: T };
}

const useGetAssetsService = () => {
  const { setAssets, setFetchAssetsError, setFetchAssetsLoading } =
    useAssetsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Asset[]>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setFetchAssetsLoading });

  const getAssets = () => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: API_ENDPOINTS.GET_ASSETS,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<Asset[]>) => {
            console.log("Assets fetch successful:", response);
            setAssets(response?.data?.assets || []);
            setFetchAssetsError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Assets not found",
          callback: (response: ApiResponse<Asset[]>) => {
            console.error("Assets not found:", response);
            setFetchAssetsError("No assets found");
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
          setFetchAssetsError("Something went wrong, please try again later");
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
    getAssets,
    cancelAPIRequest,
  };
};

export default useGetAssetsService;
