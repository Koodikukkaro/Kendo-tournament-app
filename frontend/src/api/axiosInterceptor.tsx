import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AUTH_API, axiosAuthInstance, axiosInstance } from "./axios";
import useToast from "hooks/useToast";
import type { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { type ApiErrorResponse } from "types/responses";
import routePaths from "routes/route-paths";
import { useTranslation } from "react-i18next";

/**
 * Component responsible for setting up a response interceptor
 * to handle authentication-related errors.
 *
 * When a 401 status code is encountered, it checks if the error
 * is due to an expired JWT token. If so, it attempts to refresh
 * the token and re-executes the original request. If the token
 * refresh fails, it redirects the user to the login page.
 */
const InterceptorSetup = (): null => {
  const interceptorId = React.useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  const { t } = useTranslation();

  const handleTokenExpiration = async (
    originalRequest?: AxiosRequestConfig
  ): Promise<void> => {
    try {
      // Attempt to refresh the JWT token.
      await axiosAuthInstance.get(`${AUTH_API}/refresh`);

      // Retry the original request after token refresh if any, otherwise resolve the promise.
      originalRequest !== undefined
        ? await axiosInstance(originalRequest)
        : await Promise.resolve();
    } catch (error) {
      showToast(t("messages.session_expired_message"), "error");

      // If token refresh fails, redirect the user to the login page, but store the state they were.
      // This way we can redirect them back to where they left.
      navigate(routePaths.login, { replace: true, state: { from: location } });
    }
  };

  React.useEffect(() => {
    const onResponseSuccess = (response: AxiosResponse): AxiosResponse =>
      response;
    const onResponseError = async (
      error: AxiosError<ApiErrorResponse>
    ): Promise<undefined> => {
      const { config: originalRequest, response } = error;

      // If the error is not related to unauthorized or token expiration, reject the promise
      if (response?.status !== 401) {
        await Promise.reject(error);
        return;
      }

      const { errors } = response.data;

      // Checks if the error is due to an expired JWT token
      if (
        Array.isArray(errors) &&
        errors.length > 0 &&
        errors[0].message === "jwt expired"
      ) {
        await handleTokenExpiration(originalRequest);
      }
    };

    interceptorId.current = axiosInstance.interceptors.response.use(
      onResponseSuccess,
      onResponseError
    );

    // Cleanup: Eject the interceptor when the component is unmounted
    return () => {
      if (interceptorId.current !== null) {
        axiosInstance.interceptors.response.eject(interceptorId.current);
      }
    };
  }, []);

  return null;
};

export default InterceptorSetup;
