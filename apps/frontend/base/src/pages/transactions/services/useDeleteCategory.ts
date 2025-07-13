import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useCategoriesStore } from "@/shared/stores";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { id: T };
}

const useDeleteCategoryService = () => {
  const { removeCategory, setDeleteCategoryError, setDeleteCategoryLoading } =
    useCategoriesStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<string>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setDeleteCategoryLoading });

  const deleteCategory = (categoryId: string) => {
    const apiConfig = {
      method: API_METHODS.DELETE,
      url: `${API_ENDPOINTS.DELETE_CATEGORY}/${categoryId}`,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 204,
          status_txt: "Category deleted successfully",
          callback: (response: ApiResponse<string>) => {
            console.log("Category deletion successful:", response);
            removeCategory(categoryId);
            setDeleteCategoryError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Category not found",
          callback: (response: ApiResponse<string>) => {
            console.error("Category not found:", response);
            setDeleteCategoryError("Category not found");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Category deletion failed:", error);
          setDeleteCategoryError(
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
    deleteCategory,
    cancelAPIRequest,
  };
};

export default useDeleteCategoryService;
