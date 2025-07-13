import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useAssetsStore } from "@/shared/stores";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { id: T };
}

const useDeleteAssetService = () => {
  const { removeAsset, setDeleteAssetError, setDeleteAssetLoading } =
    useAssetsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<string>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setDeleteAssetLoading });

  const deleteAsset = (assetId: string) => {
    const apiConfig = {
      method: API_METHODS.DELETE,
      url: `${API_ENDPOINTS.DELETE_ASSET}/${assetId}`,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 204,
          status_txt: "Asset deleted successfully",
          callback: (response: ApiResponse<string>) => {
            console.log("Asset deletion successful:", response);
            removeAsset(assetId);
            setDeleteAssetError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Asset not found",
          callback: (response: ApiResponse<string>) => {
            console.error("Asset not found:", response);
            setDeleteAssetError("Asset not found");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Asset deletion failed:", error);
          setDeleteAssetError("Something went wrong, please try again later");
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
    deleteAsset,
    cancelAPIRequest,
  };
};

export default useDeleteAssetService;
