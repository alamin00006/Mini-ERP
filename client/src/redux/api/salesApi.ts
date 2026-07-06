import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SalePayload } from "@/types";
import { getBaseUrl } from "@/config/envConfig";

export const salesApi = createApi({
  reducerPath: "salesApi",
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
  tagTypes: ["Sales", "Dashboard"],
  endpoints: (build) => ({
    createSale: build.mutation<{ id: string | number }, SalePayload>({
      query: (payload) => ({
        url: "/api/sales",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Sales", "Dashboard"],
    }),
  }),
});

export const { useCreateSaleMutation } = salesApi;
