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
  }),
});

export const { useCreateSaleMutation } = salesApi;
