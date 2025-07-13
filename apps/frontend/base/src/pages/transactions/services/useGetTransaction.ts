import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useTransactionsStore } from "@/shared/stores";
import { Transaction } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { transaction: T };
}

const useGetTransactionService = () => {
  const {
    setSelectedTransaction,
    setFetchTransactionError,
    setFetchTransactionLoading,
  } = useTransactionsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Transaction>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setFetchTransactionLoading });

  const getTransaction = (transactionId: string) => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: `${API_ENDPOINTS.GET_TRANSACTION}/${transactionId}`,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<Transaction>) => {
            console.log("Transaction fetch successful:", response);
            setSelectedTransaction(response?.data?.transaction || null);
            setFetchTransactionError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Transaction not found",
          callback: (response: ApiResponse<Transaction>) => {
            console.error("Transaction not found:", response);
            setFetchTransactionError("Transaction not found");
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
          setFetchTransactionError(
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
    getTransaction,
    cancelAPIRequest,
  };
};

export default useGetTransactionService;
