export type UserRole = "admin" | "manager" | "employee";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Product {
  id: string | number;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image?: string | null;
}

export interface ProductsListResponse {
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
