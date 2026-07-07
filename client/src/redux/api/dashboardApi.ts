import { baseApi } from "./baseApi";
import type { DashboardResponse } from "@/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStats: build.query<DashboardResponse, void>({
      query: () => ({ url: "/dashboard", method: "GET" }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
