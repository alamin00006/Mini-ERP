export { store, useAppDispatch, useAppSelector, type RootState, type AppDispatch } from "./store";
export { baseApi } from "./api/baseApi";
export { hydrate, setCredentials, logout } from "./slices/authSlice";
export { useLoginMutation } from "./api/authApi";
export {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "./api/productApi";
export { useGetStatsQuery } from "./api/dashboardApi";
export { useCreateSaleMutation, useGetSalesQuery } from "./api/salesApi";
export {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
} from "./api/usersApi";
export {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "./api/rolesApi";
export {
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "./api/permissionsApi";
export {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "./api/categoryApi";
export {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "./api/notificationsApi";
