import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useTransactionsStore } from "@/shared/stores";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { id: T };
}

const useDeleteTransactionService = () => {
  const {
    removeTransaction,
    setDeleteTransactionError,
    setDeleteTransactionLoading,
  } = useTransactionsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<string>
  >(
    { cancelAPIOnUnmount: true },
    { loaderAction: setDeleteTransactionLoading }
  );

  const deleteTransaction = (transactionId: string) => {
    const apiConfig = {
      method: API_METHODS.DELETE,
      url: `${API_ENDPOINTS.DELETE_TRANSACTION}/${transactionId}`,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 204,
          status_txt: "Transaction deleted successfully",
          callback: (response: ApiResponse<string>) => {
            console.log("Transaction deletion successful:", response);
            removeTransaction(transactionId);
            setDeleteTransactionError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Transaction not found",
          callback: (response: ApiResponse<string>) => {
            console.error("Transaction not found:", response);
            setDeleteTransactionError("Transaction not found");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Transaction deletion failed:", error);
          setDeleteTransactionError(
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
    deleteTransaction,
    cancelAPIRequest,
  };
};

export default useDeleteTransactionService;
