import { authApi } from "./authApi";
import { productApi } from "./productApi";
import { dashboardApi } from "./dashboardApi";
import { salesApi } from "./salesApi";

export { authApi, productApi, dashboardApi, salesApi };

export const { useLoginMutation } = authApi;

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

export const { useGetStatsQuery } = dashboardApi;

export const { useCreateSaleMutation } = salesApi;
