import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DashboardStats } from "@/types";
import { getBaseUrl } from "@/config/envConfig";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("erp_token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Dashboard"],
  endpoints: (build) => ({
    getStats: build.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
