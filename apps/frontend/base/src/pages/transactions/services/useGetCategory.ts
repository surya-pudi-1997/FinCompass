import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useCategoriesStore } from "@/shared/stores";
import { TransactionCategory } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { category: T };
}

const useGetCategoryService = () => {
  const {
    setSelectedCategory,
    setFetchCategoryError,
    setFetchCategoryLoading,
  } = useCategoriesStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Category>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setFetchCategoryLoading });

  const getCategory = (categoryId: string) => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: `${API_ENDPOINTS.GET_CATEGORY}/${categoryId}`,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<Category>) => {
            console.log("Category fetch successful:", response);
            setSelectedCategory(response?.data?.category || null);
            setFetchCategoryError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Category not found",
          callback: (response: ApiResponse<Category>) => {
            console.error("Category not found:", response);
            setFetchCategoryError("Category not found");
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
          setFetchCategoryError("Something went wrong, please try again later");
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
    getCategory,
    cancelAPIRequest,
  };
};

export default useGetCategoryService;
