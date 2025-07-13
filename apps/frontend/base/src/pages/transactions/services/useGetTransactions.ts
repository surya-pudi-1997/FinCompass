import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useTransactionsStore } from "@/shared/stores";
import { Transaction } from "@fin-compass/types";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { transactions: T };
}

const useGetTransactionsService = () => {
  const {
    setTransactions,
    setFetchTransactionsError,
    setFetchTransactionsLoading,
  } = useTransactionsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Transaction[]>
  >(
    { cancelAPIOnUnmount: true },
    { loaderAction: setFetchTransactionsLoading }
  );

  const getTransactions = () => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: API_ENDPOINTS.GET_TRANSACTIONS,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<Transaction[]>) => {
            console.log("Transactions fetch successful:", response);
            setTransactions(response?.data?.transactions || []);
            setFetchTransactionsError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Transactions not found",
          callback: (response: ApiResponse<Transaction[]>) => {
            console.error("Transactions not found:", response);
            setFetchTransactionsError("No transactions found");
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
          setFetchTransactionsError(
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
    getTransactions,
    cancelAPIRequest,
  };
};

export default useGetTransactionsService;
