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
  data: { account: T };
}

const useGetAccountService = () => {
  const { setSelectedAccount, setFetchAccountError, setFetchAccountLoading } =
    useAccountsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Account>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setFetchAccountLoading });

  const getAccount = (accountId: string) => {
    const apiConfig = {
      method: API_METHODS.GET,
      url: `${API_ENDPOINTS.GET_ACCOUNT}/${accountId}`,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Success",
          callback: (response: ApiResponse<Account>) => {
            console.log("Account fetch successful:", response);
            setSelectedAccount(response?.data?.account || null);
            setFetchAccountError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Account not found",
          callback: (response: ApiResponse<Account>) => {
            console.error("Account not found:", response);
            setFetchAccountError("Account not found");
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
          setFetchAccountError("Something went wrong, please try again later");
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
    getAccount,
    cancelAPIRequest,
  };
};

export default useGetAccountService;
