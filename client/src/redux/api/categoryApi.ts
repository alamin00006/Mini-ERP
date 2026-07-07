import { baseApi } from "./baseApi";
import type { Category, CategoriesListResponse } from "@/types";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<CategoriesListResponse, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["category"],
    }),
    getCategory: build.query<Category, string | number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "category", id }],
    }),
    createCategory: build.mutation<
      Category,
      { name: string; description?: string; isActive?: boolean }
    >({
      query: (payload) => ({
        url: "/categories",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["category"],
    }),
    updateCategory: build.mutation<
      Category,
      { id: string | number; payload: { name?: string; description?: string; isActive?: boolean } }
    >({
      query: ({ id, payload }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "category", id }, "category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
