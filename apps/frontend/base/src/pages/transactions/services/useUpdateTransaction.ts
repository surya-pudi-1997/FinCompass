import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useTransactionsStore } from "@/shared/stores";
import { UpdateTransactionDto, Transaction } from "@fin-compass/types";
import useGetTransactionsService from "./useGetTransactions";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { transaction: T };
}

const useUpdateTransactionService = () => {
  const {
    updateTransaction: updateTransactionInStore,
    setUpdateTransactionError,
    setUpdateTransactionLoading,
  } = useTransactionsStore();

  const { getTransactions } = useGetTransactionsService();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Transaction>
  >(
    { cancelAPIOnUnmount: false },
    { loaderAction: setUpdateTransactionLoading }
  );

  const updateTransaction = (
    transactionId: string,
    transactionData: UpdateTransactionDto
  ) => {
    const apiConfig = {
      method: API_METHODS.PUT,
      url: `${API_ENDPOINTS.UPDATE_TRANSACTION}/${transactionId}`,
      payload: transactionData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Transaction updated successfully",
          callback: (response: ApiResponse<Transaction>) => {
            console.log("Transaction update successful:", response);
            updateTransactionInStore(
              transactionId,
              response?.data?.transaction
            );
            getTransactions();
            setUpdateTransactionError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<Transaction>) => {
            console.error("Validation error:", response);
            setUpdateTransactionError("Please check your input and try again");
          },
        },
        {
          status_code: 404,
          status_txt: "Transaction not found",
          callback: (response: ApiResponse<Transaction>) => {
            console.error("Transaction not found:", response);
            setUpdateTransactionError("Transaction not found");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Transaction update failed:", error);
          setUpdateTransactionError(
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
    updateTransaction,
    cancelAPIRequest,
  };
};

export default useUpdateTransactionService;
