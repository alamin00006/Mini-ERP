import type { Product } from "./product";

export interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalSaleAmount: number;
  lowStockCount: number;
  lowStockProducts: Product[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}
