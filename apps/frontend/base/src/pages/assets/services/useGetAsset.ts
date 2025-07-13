import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useAssetsStore } from "@/shared/stores";
import { Asset } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { asset: T };
}

const useGetAssetService = () => {
  const { setSelectedAsset, setFetchAssetError, setFetchAssetLoading } =
    useAssetsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Asset>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setFetchAssetLoading });

  const getAsset = (assetId: string) => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: `${API_ENDPOINTS.GET_ASSET}/${assetId}`,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<Asset>) => {
            console.log("Asset fetch successful:", response);
            setSelectedAsset(response?.data?.asset || null);
            setFetchAssetError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Asset not found",
          callback: (response: ApiResponse<Asset>) => {
            console.error("Asset not found:", response);
            setFetchAssetError("Asset not found");
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
          setFetchAssetError("Something went wrong, please try again later");
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
    getAsset,
    cancelAPIRequest,
  };
};

export default useGetAssetService;
