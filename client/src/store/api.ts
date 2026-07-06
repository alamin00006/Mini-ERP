import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  DashboardStats,
  LoginResponse,
  Product,
  ProductsListResponse,
  SalePayload,
} from "@/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:4000",
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
  tagTypes: ["Products", "Dashboard", "Sales"],
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Dashboard"],
    }),
    getDashboardStats: build.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
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
      invalidatesTags: ["Products", "Dashboard"],
    }),
    updateProduct: build.mutation<Product, { id: string | number; form: FormData }>({
      query: ({ id, form }) => ({
        url: `/api/products/${id}`,
        method: "PATCH",
        body: form,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Products", id }, "Products", "Dashboard"],
    }),
    deleteProduct: build.mutation<null, string | number>({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Dashboard"],
    }),
    createSale: build.mutation<{ id: string | number }, SalePayload>({
      query: (payload) => ({
        url: "/api/sales",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetDashboardStatsQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateSaleMutation,
} = api;
