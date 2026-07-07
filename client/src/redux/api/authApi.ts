import { baseApi } from "./baseApi";
import type { LoginResponse } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
