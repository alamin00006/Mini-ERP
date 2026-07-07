import { baseApi } from "./baseApi";
import type { SalePayload } from "@/types";

export const salesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSale: build.mutation<{ id: string | number }, SalePayload>({
      query: (payload) => ({
        url: "/sales",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Sales", "Dashboard"],
    }),
    getSales: build.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/sales",
        method: "GET",
        params,
      }),
      providesTags: ["Sales"],
    }),
  }),
});

export const { useCreateSaleMutation, useGetSalesQuery } = salesApi;
