export type UserRole = "Admin" | "Manager" | "Employee";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string; // This is the category _id (ObjectId as string)
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image?: string | null;
}

export interface ProductFormValues {
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
}

export interface ProductsListResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  lowStockCount: number;
  lowStockProducts: Product[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface SaleItemPayload {
  product: string | number;
  quantity: number;
}

export interface SalePayload {
  products: SaleItemPayload[];
}

export interface Role {
  _id: string | number;
  name: string;
  description?: string;
  isSystem: boolean;
}

export interface Permission {
  _id: string | number;
  key: string;
  name: string;
  description?: string;
  group?: string;
  module?: string;
  isSystem: boolean;
}

export interface PermissionListResponse {
  success: boolean;
  message: string;
  data: Permission[];
}
export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CategoriesListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface RolesListResponse {
  success: boolean;
  message: string;
  data: Role[];
}

export interface PermissionsListResponse {
  success: boolean;
  message: string;
  data: Permission[];
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface Notification {
  _id: string;
  message: string;
  type: string;
  status: string;
  timestamp: string;
}

export interface NotificationsListResponse {
  success: boolean;
  message: string;
  data: Notification[];
}
