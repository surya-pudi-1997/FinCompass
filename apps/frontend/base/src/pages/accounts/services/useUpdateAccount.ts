import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useAccountsStore } from "@/shared/stores";
import { UpdateAccountDto, CreateAccountDto } from "@fin-compass/types";

interface Account extends CreateAccountDto {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  payload: { account: T };
}

const useUpdateAccountService = () => {
  const {
    updateAccount: updateAccountInStore,
    setUpdateAccountError,
    setUpdateAccountLoading,
  } = useAccountsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Account>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setUpdateAccountLoading });

  const updateAccount = (accountId: string, accountData: UpdateAccountDto) => {
    const apiConfig = {
      method: API_METHODS.PUT,
      url: `${API_ENDPOINTS.UPDATE_ACCOUNT}/${accountId}`,
      payload: accountData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 200,
          status_txt: "Account updated successfully",
          callback: (response: ApiResponse<Account>) => {
            console.log("Account update successful:", response);
            updateAccountInStore(accountId, response?.data?.account);
            setUpdateAccountError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<Account>) => {
            console.error("Validation error:", response);
            setUpdateAccountError("Please check your input and try again");
          },
        },
        {
          status_code: 404,
          status_txt: "Account not found",
          callback: (response: ApiResponse<Account>) => {
            console.error("Account not found:", response);
            setUpdateAccountError("Account not found");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Account update failed:", error);
          setUpdateAccountError("Something went wrong, please try again later");
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
    updateAccount,
    cancelAPIRequest,
  };
};

export default useUpdateAccountService;
