import { baseApi } from "./baseApi";
import type { ApiEnvelope, Product, ProductsListResponse } from "@/types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<
      ProductsListResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["product"],
    }),
    getProduct: build.query<ApiEnvelope<Product>, string | number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "product", id }],
    }),
    createProduct: build.mutation<Product, FormData>({
      query: (form) => ({
        url: "/products",
        method: "POST",
        data: form,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: build.mutation<Product, { id: string | number; form: FormData }>({
      query: ({ id, form }) => ({
        url: `/products/${id}`,
        method: "PUT",
        data: form,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "product", id }, "product"],
    }),
    deleteProduct: build.mutation<null, string | number>({
      query: (id) => ({
        url: `/products/${id}/delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["product"],
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
