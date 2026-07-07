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
