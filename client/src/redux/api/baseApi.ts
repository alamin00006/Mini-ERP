import { axiosBaseQuery } from "../../lib/axios/axiosBaseQuery";
import { getBaseUrl } from "@/config/envConfg";
import { createApi } from "@reduxjs/toolkit/query/react";

type TagType =
  | "user"
  | "auth"
  | "product"
  | "role"
  | "Dashboard"
  | "Sales"
  | "Users"
  | "Roles"
  | "Permissions"
  | "Notifications"
  | "category";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: getBaseUrl() }),
  tagTypes: [
    "user",
    "auth",
    "product",
    "role",
    "Dashboard",
    "Sales",
    "Users",
    "Roles",
    "Permissions",
    "Notifications",
    "category",
  ] as TagType[],
  endpoints: () => ({}),
});
