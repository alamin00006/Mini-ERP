export interface Product {
  data: any;
  _id: string;
  name: string;
  sku: string;
  categoryId: string;
  category: string;
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
