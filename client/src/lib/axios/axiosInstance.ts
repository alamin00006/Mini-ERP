import { getBaseUrl } from "@/config/envConfg";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Extend AxiosRequestConfig to include our custom property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuthRedirect?: boolean;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl() || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: Send cookies with requests
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Add token to requests if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("erp_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle token refresh on 401 errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig & {
      sent?: boolean;
    };

    // Token expired → refresh ONLY if status is exactly 401
    if (error?.response?.status === 401 && !originalRequest?.skipAuthRedirect) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark as refreshing and start refresh process
      originalRequest.sent = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint - refresh token is automatically sent via cookie
        // Make a clean request to avoid infinite loops
        const response = await axiosInstance.post<{ data: { accessToken: string } }>(
          "/auth/refresh-token",
          {},
          { skipAuthRedirect: true } as CustomAxiosRequestConfig,
        );

        const accessToken = response?.data?.data?.accessToken;

        if (accessToken) {
          // Save new token
          localStorage.setItem("erp_token", accessToken);

          // Process all queued requests
          processQueue(null, accessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return axiosInstance(originalRequest);
        } else {
          throw new Error("No access token received");
        }
      } catch (refreshError) {
        // Refresh token failed → logout
        processQueue(refreshError, null);
        localStorage.removeItem("erp_token");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If not 401, just reject the error
    return Promise.reject(error);
  },
);

// Export function to manually set token
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("erp_token", token);
  } else {
    localStorage.removeItem("erp_token");
  }
};

// Export function to clear auth
export const clearAuth = () => {
  localStorage.removeItem("erp_token");
  localStorage.removeItem("erp_user");
  localStorage.removeItem("erp_permissions");
};
