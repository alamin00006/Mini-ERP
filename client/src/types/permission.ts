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
