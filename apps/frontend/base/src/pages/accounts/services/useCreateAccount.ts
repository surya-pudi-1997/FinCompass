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

const useCreateAccountService = () => {
  const { addAccount, setCreateAccountError, setCreateAccountLoading } =
    useAccountsStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest<
    ApiResponse<Account>
  >({ cancelAPIOnUnmount: true }, { loaderAction: setCreateAccountLoading });

  const createAccount = (accountData: CreateAccountDto) => {
    const apiConfig = {
      method: API_METHODS.POST,
      url: API_ENDPOINTS.CREATE_ACCOUNT,
      data: accountData,
    };

    const externalStatusHandlers = {
      statusHandlers: [
        {
          status_code: 201,
          status_txt: "Account created successfully",
          callback: (response: ApiResponse<Account>) => {
            console.log("Account creation successful:", response);
            addAccount(response?.data?.account);
            setCreateAccountError(null);
          },
        },
        {
          status_code: 400,
          status_txt: "Validation error",
          callback: (response: ApiResponse<Account>) => {
            console.error("Validation error:", response);
            setCreateAccountError("Please check your input and try again");
          },
        },
      ],
      statusCodePath: ["status_code"],
      statusTextPath: ["status_txt"],
      defaultFallback: (error: unknown, isCancelled?: boolean) => {
        if (isCancelled) {
          console.warn("API request was cancelled:", error);
        } else {
          console.error("Account creation failed:", error);
          setCreateAccountError("Something went wrong, please try again later");
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
    createAccount,
    cancelAPIRequest,
  };
};

export default useCreateAccountService;
