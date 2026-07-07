import { authApi } from "./authApi";
import { productApi } from "./productApi";
import { dashboardApi } from "./dashboardApi";
import { salesApi } from "./salesApi";
import { notificationsApi } from "./notificationsApi";

export { authApi, productApi, dashboardApi, salesApi, notificationsApi };

export const { useLoginMutation } = authApi;

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

export const { useGetStatsQuery } = dashboardApi;

export const { useCreateSaleMutation, useGetSalesQuery } = salesApi;

export const { useGetNotificationsQuery } = notificationsApi;
