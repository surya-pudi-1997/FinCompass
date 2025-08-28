import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useAssetsStore } from "@/shared/stores";
import { CreateAssetDto, Asset } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { asset: T };
}

const useCreateAssetService = () => {
  const { addAsset, setCreateAssetError, setCreateAssetLoading } =
    useAssetsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Asset>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setCreateAssetLoading });

  const createAsset = (assetData: CreateAssetDto) => {
    const apiConfig = {
      method: API_METHODS.POST,
      url: API_ENDPOINTS.CREATE_ASSET,
      payload: assetData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 201,
          status_txt: "Asset created successfully",
          callback: (response: ApiResponse<Asset>) => {
            console.log("Asset creation successful:", response);
            addAsset(response?.data?.asset);
            setCreateAssetError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<Asset>) => {
            console.error("Validation error:", response);
            setCreateAssetError("Please check your input and try again");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Asset creation failed:", error);
          setCreateAssetError("Something went wrong, please try again later");
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
    createAsset,
    cancelAPIRequest,
  };
};

export default useCreateAssetService;
