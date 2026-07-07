export interface Role {
  data: any;
  _id: string | number;
  name: string;
  description?: string;
  isSystem: boolean;
}

export interface RolesListResponse {
  success: boolean;
  message: string;
  data: Role[];
}
