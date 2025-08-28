import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useCategoriesStore } from "@/shared/stores";
import {
  CreateTransactionCategoryDto,
  ApiResponse,
  CategoryResponse,
} from "@fin-compass/types";

const useCreateCategoryService = () => {
  const { addCategory, setCreateCategoryError, setCreateCategoryLoading } =
    useCategoriesStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<CategoryResponse>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setCreateCategoryLoading });

  const createCategory = (categoryData: CreateTransactionCategoryDto) => {
    const apiConfig = {
      method: API_METHODS.POST,
      url: API_ENDPOINTS.CREATE_CATEGORY,
      payload: categoryData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 201,
          status_txt: "Category created successfully",
          callback: (response: ApiResponse<CategoryResponse>) => {
            console.log("Category creation successful:", response);
            addCategory(response?.data?.category);
            setCreateCategoryError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<CategoryResponse>) => {
            console.error("Validation error:", response);
            setCreateCategoryError("Please check your input and try again");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Category creation failed:", error);
          setCreateCategoryError(
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
    createCategory,
    cancelAPIRequest,
  };
};

export default useCreateCategoryService;
