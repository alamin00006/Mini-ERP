import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product, ProductsListResponse } from "@/types";
import { getBaseUrl } from "@/config/envConfig";

export const productApi = createApi({
  reducerPath: "productApi",
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
  tagTypes: ["Products"],
  endpoints: (build) => ({
    getProducts: build.query<
      ProductsListResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/api/products",
        params,
      }),
      providesTags: ["Products"],
    }),
    getProduct: build.query<Product, string | number>({
      query: (id) => `/api/products/${id}`,
      providesTags: (_, __, id) => [{ type: "Products", id }],
    }),
    createProduct: build.mutation<Product, FormData>({
      query: (form) => ({
        url: "/api/products",
        method: "POST",
        body: form,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation<Product, { id: string | number; form: FormData }>({
      query: ({ id, form }) => ({
        url: `/api/products/${id}`,
        method: "PATCH",
        body: form,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Products", id }, "Products"],
    }),
    deleteProduct: build.mutation<null, string | number>({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
