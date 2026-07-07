export interface SaleItemPayload {
  product: string | number;
  quantity: number;
}

export interface SalePayload {
  products: SaleItemPayload[];
}

export interface Sale {
  _id: string;
  products: Array<{
    product: string;
    quantity: number;
    sellingPrice: number;
    subtotal: number;
  }>;
  grandTotal: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SalesListResponse {
  success: boolean;
  message: string;
  data: Sale[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
