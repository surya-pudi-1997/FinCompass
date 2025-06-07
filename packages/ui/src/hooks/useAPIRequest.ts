import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { useEffect, useState, useCallback } from "react";

export interface ApiConfig {
  url: string;
  method: string;
  urlParams?: Record<string, string>;
  payload?: any;
}

export interface StatusHandler {
  status_code: string | number;
  status_txt: string;
  callback: (response: any) => void;
}

export interface ExternalStatusHandlers {
  statusHandlers: StatusHandler[];
  statusCodePath: string[];
  statusTextPath: string[];
  defaultFallback: (response: any, isCancelled?: boolean) => void;
}

export interface ApiRequestModes {
  mock?: boolean;
  cancelAPIOnUnmount?: boolean;
  delay?: number;
}

export interface ApiRequestActions {
  loaderAction?: (loading: boolean) => void;
}

export const useApiRequest = (
  modes: ApiRequestModes = {},
  actions: ApiRequestActions = {},
  mockedResponse?: any,
  handleUnauthorizedResponse?: (response: any) => void,
  unAuthorisedResponses: (string | number)[] = [],
  token?: string | null
) => {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<any>(null);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);

  const handleLoader = (loading: boolean) => {
    if (actions.loaderAction) {
      actions.loaderAction(loading);
    } else {
      setApiLoading(loading);
    }
  };

  const getNestedValue = (obj: any, path: string[]): any => {
    return path.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
  };

  const cancelAPIRequest = useCallback(() => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Request cancelled");
    }
  }, [cancelTokenSource]);

  useEffect(() => {
    return () => {
      if (modes.cancelAPIOnUnmount) {
        cancelAPIRequest();
      }
    };
  }, [modes.cancelAPIOnUnmount, cancelAPIRequest]);

  const apiRequestController = async ({
    apiConfig,
    externalStatusHandlers,
    additionalAPIRequestHeaders,
  }: {
    apiConfig: ApiConfig;
    externalStatusHandlers?: ExternalStatusHandlers;
    additionalAPIRequestHeaders?: Record<string, string>;
  }) => {
    handleLoader(true);
    setApiError(null);

    if (modes.mock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          handleLoader(false);
          setApiResponse(mockedResponse);
          resolve(mockedResponse);
        }, modes.delay || 1000);
      });
    }

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      const headers = {
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

      const response: AxiosResponse = await axios(config);
      handleLoader(false);

      if (externalStatusHandlers) {
        const statusCode = getNestedValue(
          response.data,
          externalStatusHandlers.statusCodePath
        );
        const statusText = getNestedValue(
          response.data,
          externalStatusHandlers.statusTextPath
        );

        const handler = externalStatusHandlers.statusHandlers.find(
          (h) =>
            String(h.status_code).toLowerCase() ===
              String(statusCode).toLowerCase() &&
            h.status_txt.toLowerCase() === String(statusText).toLowerCase()
        );

        if (handler) {
          handler.callback(response.data);
          return response.data;
        } else {
          externalStatusHandlers?.defaultFallback?.(
            "no matching status handler found",
            false
          );
        }

        if (
          unAuthorisedResponses.includes(statusCode) &&
          handleUnauthorizedResponse
        ) {
          handleUnauthorizedResponse(response.data);
          return response.data;
        }
      }

      setApiResponse(response.data);
      return response.data;
    } catch (error: any) {
      handleLoader(false);
      if (axios.isCancel(error)) {
        externalStatusHandlers?.defaultFallback?.(error, true);
      } else {
        setApiError(error);
        externalStatusHandlers?.defaultFallback?.(error, false);
      }
      throw error;
    }
  };

  return {
    apiResponse,
    apiLoading,
    apiError,
    apiRequestController,
    cancelAPIRequest,
  };
};
