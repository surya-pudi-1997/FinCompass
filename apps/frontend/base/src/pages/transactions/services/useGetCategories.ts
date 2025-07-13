import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useCategoriesStore } from "@/shared/stores";
import { Category } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { categories: T };
}

const useGetCategoriesService = () => {
  const { setCategories, setFetchCategoriesError, setFetchCategoriesLoading } =
    useCategoriesStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Category[]>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setFetchCategoriesLoading });

  const getCategories = () => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: API_ENDPOINTS.GET_CATEGORIES,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<Category[]>) => {
            console.log("Categories fetch successful:", response);
            setCategories(response?.data?.categories || []);
            setFetchCategoriesError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Categories not found",
          callback: (response: ApiResponse<Category[]>) => {
            console.error("Categories not found:", response);
            setFetchCategoriesError("No categories found");
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
          setFetchCategoriesError(
            "Something went wrong, please try again later"
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
    getCategories,
    cancelAPIRequest,
  };
};

export default useGetCategoriesService;
