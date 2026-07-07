import { axiosInstance } from "@/api/axiosInstance";
import axios, { AxiosRequestConfig } from "axios";

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
  contentType?: string;
  skipAuthRedirect?: boolean;
}

interface AxiosBaseQueryOptions {
  baseUrl?: string;
}

export const axiosBaseQuery =
  ({ baseUrl = "" }: AxiosBaseQueryOptions = {}) =>
  async ({ url, method, data, params, contentType, skipAuthRedirect }: AxiosBaseQueryArgs) => {
    try {
      const requestUrl = /^https?:\/\//i.test(url) ? url : baseUrl + url;

      const headers: Record<string, string> = {};
      if (contentType) {
        headers["Content-Type"] = contentType;
      }

      const config: AxiosRequestConfig & { skipAuthRedirect?: boolean } = {
        url: requestUrl,
        method,
        data,
        params,
        headers,
        withCredentials: true,
        skipAuthRedirect,
      };

      const result = await axiosInstance(config);

      return {
        data: {
          ...result.data,
        },
      };
    } catch (axiosError: unknown) {
      return {
        error: {
          status: axios.isAxiosError(axiosError) ? axiosError.response?.status : undefined,
          data: axios.isAxiosError(axiosError)
            ? axiosError.response?.data || axiosError.message
            : "Request failed",
        },
      };
    }
  };
