import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { API_METHODS } from "@/shared/constants/api";
import { useAccountsStore } from "@/shared/stores";

interface ApiResponse<T = unknown> {
  status_code: number;
  status_txt: string;
  data: { id: T };
}

const useDeleteAccountService = () => {
  const { removeAccount, setDeleteAccountError, setDeleteAccountLoading } =
    useAccountsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<string>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setDeleteAccountLoading });

  const deleteAccount = (accountId: string) => {
    const apiConfig = {
      method: API_METHODS.DELETE,
      url: `${API_ENDPOINTS.DELETE_ACCOUNT}/${accountId}`,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 204,
          status_txt: "Account deleted successfully",
          callback: (response: ApiResponse<string>) => {
            console.log("Account deletion successful:", response);
            removeAccount(accountId);
            setDeleteAccountError(null);
          },
        },
        {
          status_code: 404,
          status_txt: "Account not found",
          callback: (response: ApiResponse<string>) => {
            console.error("Account not found:", response);
            setDeleteAccountError("Account not found");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Account deletion failed:", error);
          setDeleteAccountError("Something went wrong, please try again later");
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
    deleteAccount,
    cancelAPIRequest,
  };
};

export default useDeleteAccountService;
