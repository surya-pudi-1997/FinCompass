import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useAccountsStore } from "@/shared/stores";
import { CreateAccountDto } from "@fin-compass/types";

interface Account extends CreateAccountDto {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { accounts: T };
}

const useGetAccountsService = () => {
  const { setAccounts, setFetchAccountsError, setFetchAccountsLoading } =
    useAccountsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Account[]>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setFetchAccountsLoading });

  const getAccounts = () => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: API_ENDPOINTS.GET_ACCOUNTS,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<Account[]>) => {
            console.log("Accounts fetch successful:", response);
            setAccounts(response?.data?.accounts || []);
            setFetchAccountsError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Accounts not found",
          callback: (response: ApiResponse<Account[]>) => {
            console.error("Accounts not found:", response);
            setFetchAccountsError("No accounts found");
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
          setFetchAccountsError("Something went wrong, please try again later");
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
    getAccounts,
    cancelAPIRequest,
  };
};

export default useGetAccountsService;
