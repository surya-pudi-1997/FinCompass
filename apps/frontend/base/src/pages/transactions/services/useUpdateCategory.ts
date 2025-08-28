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

const useUpdateCategoryService = () => {
  const {
    updateCategory: updateCategoryInStore,
    setUpdateCategoryError,
    setUpdateCategoryLoading,
  } = useCategoriesStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Category>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setUpdateCategoryLoading });

  const updateCategory = (
    categoryId: string,
    categoryData: UpdateTransactionCategoryDto
  ) => {
    const apiConfig = {
      method: API_METHODS.PUT,
      url: `${API_ENDPOINTS.UPDATE_CATEGORY}/${categoryId}`,
      data: categoryData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Category updated successfully",
          callback: (response: ApiResponse<Category>) => {
            console.log("Category update successful:", response);
            updateCategoryInStore(categoryId, response?.data?.category);
            setUpdateCategoryError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<Category>) => {
            console.error("Validation error:", response);
            setUpdateCategoryError("Please check your input and try again");
          },
        },
        {
          status_code: 404,
          status_txt: "Category not found",
          callback: (response: ApiResponse<Category>) => {
            console.error("Category not found:", response);
            setUpdateCategoryError("Category not found");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Category update failed:", error);
          setUpdateCategoryError(
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
    updateCategory,
    cancelAPIRequest,
  };
};

export default useUpdateCategoryService;
