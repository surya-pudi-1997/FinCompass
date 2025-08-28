import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useAssetsStore } from "@/shared/stores";
import { UpdateAssetDto, Asset } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { asset: T };
}

const useUpdateAssetService = () => {
  const {
    updateAsset: updateAssetInStore,
    setUpdateAssetError,
    setUpdateAssetLoading,
  } = useAssetsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Asset>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setUpdateAssetLoading });

  const updateAsset = (assetId: string, assetData: UpdateAssetDto) => {
    const apiConfig = {
      method: API_METHODS.PUT,
      url: `${API_ENDPOINTS.UPDATE_ASSET}/${assetId}`,
      payload: assetData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Asset updated successfully",
          callback: (response: ApiResponse<Asset>) => {
            console.log("Asset update successful:", response);
            updateAssetInStore(assetId, response?.data?.asset);
            setUpdateAssetError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<Asset>) => {
            console.error("Validation error:", response);
            setUpdateAssetError("Please check your input and try again");
          },
        },
        {
          status_code: 404,
          status_txt: "Asset not found",
          callback: (response: ApiResponse<Asset>) => {
            console.error("Asset not found:", response);
            setUpdateAssetError("Asset not found");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Asset update failed:", error);
          setUpdateAssetError("Something went wrong, please try again later");
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
    updateAsset,
    cancelAPIRequest,
  };
};

export default useUpdateAssetService;
