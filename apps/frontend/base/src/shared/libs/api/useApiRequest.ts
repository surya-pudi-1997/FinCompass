import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  AxiosError,
} from "axios";
import { useEffect, useState, useCallback } from "react";

import { useUserStore } from "@/shared/stores";
import { routes } from "@/router/routes";

// Types and Interfaces
export interface ApiConfig<TPayload = unknown> {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  urlParams?: Record<string, string>;
  payload?: TPayload;
}

export interface StatusHandler<TResponse = unknown> {
  status_code: string | number;
  status_txt: string;
  callback: (response: TResponse) => void;
}

export interface ExternalStatusHandlers<TResponse = unknown> {
  statusHandlers: StatusHandler<TResponse>[];
  statusCodePath?: string[];
  statusTextPath?: string[];
  defaultFallback: (
    response: TResponse | AxiosError | string,
    isCancelled?: boolean
  ) => void;
}

export interface ApiRequestModes {
  mock?: boolean;
  cancelAPIOnUnmount?: boolean;
  delay?: number;
}

export interface ApiRequestActions {
  loaderAction?: (loading: boolean) => void;
}

export interface ApiRequestOptions<TResponse = unknown> {
  apiConfig: ApiConfig<unknown>;
  externalStatusHandlers?: ExternalStatusHandlers<TResponse>;
  additionalAPIRequestHeaders?: Record<string, string>;
}

export interface UseApiRequestReturn<TResponse = unknown> {
  apiResponse: TResponse | null;
  apiLoading: boolean;
  apiError: AxiosError | null;
  apiRequestController: (options: ApiRequestOptions<TResponse>) => void;
  cancelAPIRequest: () => void;
}

// Helper function to handle navigation fallback
const handleUnauthorizedNavigation = (path: string) => {
  // Use window.location for reliable navigation regardless of Router context
  console.warn("Unauthorized access detected. Redirecting to login page.");
  window.location.href = path;
};

// Main Hook
/**
 * Custom hook for making API requests with automatic token management and unauthorized response handling
 *
 * Features:
 * - Automatically includes bearer token from user store
 * - Handles 401 unauthorized responses by logging out and redirecting to login
 * - Supports custom status handlers and error handling
 * - Optional request cancellation and loading states
 *
 * @param modes - API request configuration modes (mock, cancel, delay)
 * @param actions - Actions to execute during request lifecycle (loader actions)
 * @param mockedResponse - Response to return when in mock mode
 * @param handleUnauthorizedResponse - Custom handler for unauthorized responses
 * @param unAuthorisedResponses - Array of status codes to treat as unauthorized
 * @param explicitToken - Override token (if not provided, uses token from store)
 * @returns Object containing API response, loading state, error, and control functions
 */
export const useApiRequest = <TResponse = unknown>(
  modes: ApiRequestModes = {},
  actions: ApiRequestActions = {},
  mockedResponse?: TResponse,
  handleUnauthorizedResponse?: (response: TResponse) => void,
  unAuthorisedResponses: (string | number)[] = [],
  explicitToken?: string | null
): UseApiRequestReturn<TResponse> => {
  // Hooks
  const { token: storeToken, logout } = useUserStore();

  // Use explicit token if provided, otherwise use token from store
  const token = explicitToken !== undefined ? explicitToken : storeToken;
  // State Management
  const [apiResponse, setApiResponse] = useState<TResponse | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<AxiosError | null>(null);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);

  // Utility Functions
  const handleLoader = useCallback(
    (loading: boolean) => {
      if (actions.loaderAction) {
        actions.loaderAction(loading);
      } else {
        setApiLoading(loading);
      }
    },
    [actions.loaderAction]
  );

  const getNestedValue = useCallback(
    (obj: Record<string, unknown>, path: string[]): unknown => {
      return path.reduce((acc, key) => {
        if (acc && typeof acc === "object" && acc !== null && key in acc) {
          return (acc as Record<string, unknown>)[key];
        }
        return undefined;
      }, obj as unknown);
    },
    []
  );

  const cancelAPIRequest = useCallback(() => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Request cancelled");
    }
  }, [cancelTokenSource]);

  // Effects
  useEffect(() => {
    return () => {
      if (modes.cancelAPIOnUnmount) {
        cancelAPIRequest();
      }
    };
  }, [modes.cancelAPIOnUnmount, cancelAPIRequest]);

  // Main API Request Controller
  const apiRequestController = ({
    apiConfig,
    externalStatusHandlers,
    additionalAPIRequestHeaders,
  }: ApiRequestOptions<TResponse>): void => {
    handleLoader(true);
    setApiError(null);

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...additionalAPIRequestHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const config: AxiosRequestConfig = {
      url: apiConfig.url,
      method: apiConfig.method,
      data: apiConfig.payload,
      params: apiConfig.urlParams,
      headers,
      cancelToken: source.token,
    };

    // Mock Response Handling
    if (modes.mock && mockedResponse) {
      setTimeout(() => {
        handleLoader(false);
        setApiResponse(mockedResponse);
      }, modes.delay || 1000);
      return;
    }

    // Real API Request
    axios(config)
      .then((response: AxiosResponse<TResponse>) => {
        handleLoader(false);

        // Handle External Status Handlers
        if (externalStatusHandlers) {
          const statusCode = getNestedValue(
            response.data as Record<string, unknown>,
            externalStatusHandlers.statusCodePath || ["status_code"]
          );
          const statusText = getNestedValue(
            response.data as Record<string, unknown>,
            externalStatusHandlers.statusTextPath || ["status_txt"]
          );

          const handler = externalStatusHandlers.statusHandlers.find(
            (h) =>
              String(h.status_code).toLowerCase() ===
                String(statusCode).toLowerCase() &&
              h.status_txt.toLowerCase() === String(statusText).toLowerCase()
          );

          if (handler) {
            handler.callback(response.data);
            setApiResponse(response.data);
            return;
          }

          // Handle Unauthorized Responses (401 or specific status codes)
          if (
            typeof statusCode === "string" ||
            typeof statusCode === "number"
          ) {
            // Check for 401 Unauthorized or "Unauthorized" status text
            if (
              statusCode === 401 ||
              statusCode === "401" ||
              String(statusText).toLowerCase().includes("unauthorized")
            ) {
              console.warn(
                "Unauthorized access detected. Logging out and redirecting to login."
              );
              logout();
              handleUnauthorizedNavigation(routes.LOGIN);
              return;
            }

            // Check for custom unauthorized responses
            if (
              unAuthorisedResponses.includes(statusCode) &&
              handleUnauthorizedResponse
            ) {
              handleUnauthorizedResponse(response.data);
              setApiResponse(response.data);
              return;
            }
          }

          // Default Fallback
          externalStatusHandlers.defaultFallback(
            "no matching status handler found",
            false
          );
        }

        setApiResponse(response.data);
      })
      .catch((error: unknown) => {
        handleLoader(false);
        const axiosError = error as AxiosError;

        // Handle 401 Unauthorized HTTP status code
        if (axiosError.response?.status === 401) {
          console.warn(
            "HTTP 401 Unauthorized detected. Logging out and redirecting to login."
          );
          logout();
          handleUnauthorizedNavigation(routes.LOGIN);
          return;
        }

        if (axios.isCancel(axiosError)) {
          externalStatusHandlers?.defaultFallback?.(axiosError, true);
        } else {
          setApiError(axiosError);
          externalStatusHandlers?.defaultFallback?.(axiosError, false);
        }
      });
  };

  return {
    apiResponse,
    apiLoading,
    apiError,
    apiRequestController,
    cancelAPIRequest,
  };
};
