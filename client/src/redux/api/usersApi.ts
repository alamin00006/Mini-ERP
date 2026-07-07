import { baseApi } from "./baseApi";
import type { User, UsersListResponse } from "@/types";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersListResponse, void>({
      query: () => ({ url: "/users", method: "GET" }),
      providesTags: ["user"],
    }),
    getUser: build.query<User, string | number>({
      query: (id) => ({ url: `/users/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "user", id }],
    }),
    createUser: build.mutation<User, CreateUserPayload>({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: build.mutation<User, { id: string | number; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "user", id }, "user"],
    }),
    toggleUserStatus: build.mutation<User, string | number>({
      query: (id) => ({
        url: `/users/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
} = usersApi;
