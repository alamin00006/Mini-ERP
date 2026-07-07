import { axiosInstance } from "./axiosInstance";
import type {
  ApiEnvelope,
  DashboardStats,
  LoginResponse,
  Product,
  ProductsListResponse,
  SalePayload,
  User,
  Role,
  Permission,
  Notification,
  NotificationsListResponse,
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

export const usersApi = {
  list: async () => {
    const { data } = await axiosInstance.get<ApiEnvelope<User[]>>("/api/users");
    return unwrap(data);
  },
  get: async (id: string | number) => {
    const { data } = await axiosInstance.get<ApiEnvelope<User>>(`/api/users/${id}`);
    return unwrap(data);
  },
  create: async (payload: { name: string; email: string; password: string; role: string }) => {
    const { data } = await axiosInstance.post<ApiEnvelope<User>>("/api/users", payload);
    return unwrap(data);
  },
  update: async (
    id: string | number,
    payload: { name?: string; email?: string; password?: string; role?: string },
  ) => {
    const { data } = await axiosInstance.put<ApiEnvelope<User>>(`/api/users/${id}`, payload);
    return unwrap(data);
  },
  deactivate: async (id: string | number) => {
    const { data } = await axiosInstance.patch<ApiEnvelope<User>>(`/api/users/${id}/deactivate`);
    return unwrap(data);
  },
};

export const rolesApi = {
  list: async () => {
    const { data } = await axiosInstance.get<ApiEnvelope<Role[]>>("/api/roles");
    return unwrap(data);
  },
  get: async (id: string | number) => {
    const { data } = await axiosInstance.get<ApiEnvelope<Role>>(`/api/roles/${id}`);
    return unwrap(data);
  },
  create: async (payload: { name: string; description?: string }) => {
    const { data } = await axiosInstance.post<ApiEnvelope<Role>>("/api/roles", payload);
    return unwrap(data);
  },
  update: async (id: string | number, payload: { name?: string; description?: string }) => {
    const { data } = await axiosInstance.put<ApiEnvelope<Role>>(`/api/roles/${id}`, payload);
    return unwrap(data);
  },
  deactivate: async (id: string | number) => {
    const { data } = await axiosInstance.patch<ApiEnvelope<Role>>(`/api/roles/${id}/deactivate`);
    return unwrap(data);
  },
};

export const permissionsApi = {
  list: async () => {
    const { data } = await axiosInstance.get<ApiEnvelope<Permission[]>>("/api/permissions");
    return unwrap(data);
  },
  get: async (id: string | number) => {
    const { data } = await axiosInstance.get<ApiEnvelope<Permission>>(`/api/permissions/${id}`);
    return unwrap(data);
  },
  create: async (payload: {
    key: string;
    name: string;
    description?: string;
    group?: string;
    module?: string;
  }) => {
    const { data } = await axiosInstance.post<ApiEnvelope<Permission>>("/api/permissions", payload);
    return unwrap(data);
  },
  update: async (
    id: string | number,
    payload: { key?: string; name?: string; description?: string; group?: string; module?: string },
  ) => {
    const { data } = await axiosInstance.put<ApiEnvelope<Permission>>(
      `/api/permissions/${id}`,
      payload,
    );
    return unwrap(data);
  },
  delete: async (id: string | number) => {
    const { data } = await axiosInstance.delete<ApiEnvelope<null>>(`/api/permissions/${id}`);
    return unwrap(data);
  },
};

export const notificationsApi = {
  list: async () => {
    const { data } = await axiosInstance.get<ApiEnvelope<Notification[]>>("/api/notifications");
    return unwrap(data);
  },
};
