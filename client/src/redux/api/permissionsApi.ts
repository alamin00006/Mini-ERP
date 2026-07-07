import { baseApi } from "./baseApi";
import type { Permission, PermissionListResponse } from "@/types";

export const permissionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPermissions: build.query<PermissionListResponse, void>({
      query: () => ({ url: "/permissions", method: "GET" }),
      providesTags: ["Permissions"],
    }),
    getPermission: build.query<Permission, string | number>({
      query: (id) => ({ url: `/permissions/${id}`, method: "GET" }),
      providesTags: (_, __, id) => [{ type: "Permissions", id }],
    }),
    createPermission: build.mutation<
      Permission,
      { key: string; name: string; description?: string; group?: string; module?: string }
    >({
      query: (payload) => ({
        url: "/permissions",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Permissions"],
    }),
    updatePermission: build.mutation<
      Permission,
      {
        id: string | number;
        data: {
          key?: string;
          name?: string;
          description?: string;
          group?: string;
          module?: string;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `/permissions/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Permissions", id }, "Permissions"],
    }),
    deletePermission: build.mutation<void, string | number>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permissions"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionsApi;
