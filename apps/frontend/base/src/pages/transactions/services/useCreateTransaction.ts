import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useTransactionsStore } from "@/shared/stores";
import { CreateTransactionDto, Transaction } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { transaction: T };
}

const useCreateTransactionService = () => {
  const {
    addTransaction,
    setCreateTransactionError,
    setCreateTransactionLoading,
  } = useTransactionsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Transaction>
  >(
    { cancelAPIOnUnmount: true },
    { loaderAction: setCreateTransactionLoading }
  );

  const createTransaction = (transactionData: CreateTransactionDto) => {
    const apiConfig = {
      method: API_METHODS.POST,
      url: API_ENDPOINTS.CREATE_TRANSACTION,
      data: transactionData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 201,
          status_txt: "Transaction created successfully",
          callback: (response: ApiResponse<Transaction>) => {
            console.log("Transaction creation successful:", response);
            addTransaction(response?.data?.transaction);
            setCreateTransactionError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<Transaction>) => {
            console.error("Validation error:", response);
            setCreateTransactionError("Please check your input and try again");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Transaction creation failed:", error);
          setCreateTransactionError(
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
    createTransaction,
    cancelAPIRequest,
  };
};

export default useCreateTransactionService;
