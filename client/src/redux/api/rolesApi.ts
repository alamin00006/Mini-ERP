import { baseApi } from "./baseApi";
import type { ApiEnvelope, Role, RolesListResponse } from "@/types";

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<RolesListResponse, void>({
      query: () => ({ url: "/roles", method: "GET" }),
      providesTags: ["role"],
    }),
    getRole: build.query<Role, string | number>({
      query: (id) => ({ url: `/roles/${id}`, method: "GET" }),
      providesTags: (_, __, id) => [{ type: "role", id }],
    }),
    createRole: build.mutation<Role, { name: string; description?: string }>({
      query: (payload) => ({
        url: "/roles",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["role"],
    }),
    updateRole: build.mutation<
      Role,
      { id: string | number; data: { name?: string; description?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "role", id }, "role"],
    }),
    deleteRole: build.mutation<void, string | number>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["role"],
    }),
    setRolePermissions: build.mutation<
      ApiEnvelope<void>,
      { roleId: string | number; permissions: string[] }
    >({
      query: ({ roleId, permissions }) => ({
        url: `/roles/${roleId}`,
        method: "PUT",
        data: { permissions },
      }),
      invalidatesTags: (_, __, { roleId }) => [{ type: "role", id: roleId }, "role", "Permissions"],
    }),
    getRolePermissions: build.query<ApiEnvelope<{ permissions: string[] }>, string | number>({
      query: (id) => ({ url: `/roles/${id}`, method: "GET" }),
      providesTags: (_, __, id) => [{ type: "role", id }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useSetRolePermissionsMutation,
  useGetRolePermissionsQuery,
} = rolesApi;
