import { axiosBaseQuery } from "./axiosBaseQuery";
import { getBaseUrl } from "@/config/envConfig";
import { createApi } from "@reduxjs/toolkit/query/react";

type TagType =
  | "user"
  | "auth"
  | "brand"
  | "branch"
  | "product"
  | "order"
  | "role"
  | "employee"
  | "department"
  | "service_order"
  | "company_Info"
  | "client_product"
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
    "brand",
    "branch",
    "product",
    "order",
    "role",
    "employee",
    "department",
    "service_order",
    "company_Info",
    "client_product",
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
