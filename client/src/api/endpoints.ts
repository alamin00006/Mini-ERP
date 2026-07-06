import { axiosInstance } from "./axiosInstance";
import type {
  ApiEnvelope,
  DashboardStats,
  LoginResponse,
  Product,
  ProductsListResponse,
  SalePayload,
} from "@/types";

const unwrap = <T>(envelope: ApiEnvelope<T>): T => {
  return envelope.data;
};

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await axiosInstance.post<ApiEnvelope<LoginResponse>>("/api/auth/login", {
      email,
      password,
    });
    return unwrap(data);
  },
};

export const dashboardApi = {
  stats: async () => {
    const { data } = await axiosInstance.get<ApiEnvelope<DashboardStats>>("/dashboard/stats");
    return unwrap(data);
  },
};

export const productsApi = {
  list: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const { data } = await axiosInstance.get<ApiEnvelope<ProductsListResponse>>("/api/products", {
      params,
    });
    return unwrap(data);
  },
  get: async (id: string | number) => {
    const { data } = await axiosInstance.get<ApiEnvelope<Product>>(`/api/products/${id}`);
    return unwrap(data);
  },
  create: async (form: FormData) => {
    const { data } = await axiosInstance.post<ApiEnvelope<Product>>("/api/products", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(data);
  },
  update: async (id: string | number, form: FormData) => {
    const { data } = await axiosInstance.patch<ApiEnvelope<Product>>(`/api/products/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(data);
  },
  remove: async (id: string | number) => {
    const { data } = await axiosInstance.delete<ApiEnvelope<null>>(`/api/products/${id}`);
    return unwrap(data);
  },
};

export const salesApi = {
  create: async (payload: SalePayload) => {
    const { data } = await axiosInstance.post<ApiEnvelope<{ id: string | number }>>(
      "/api/sales",
      payload,
    );
    return unwrap(data);
  },
};
