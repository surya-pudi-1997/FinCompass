import { useCallback } from "react";
import {
  useApiRequest,
  ApiRequestActions,
  ApiRequestModes,
} from "@fin-compass/ui";

export const useApiCall = (
  modes: ApiRequestModes = {},
  actions: ApiRequestActions = {}
) => {
  const handleUnauthorized = useCallback(() => {
    window.location.href = "/login";
  }, []);

  // Common unauthorized response codes
  const unauthorizedResponses = ["401", 401, "UNAUTHORIZED", "unauthorized"];

  return useApiRequest(
    modes,
    actions,
    undefined, // No mocked response
    handleUnauthorized,
    unauthorizedResponses
  );
};
