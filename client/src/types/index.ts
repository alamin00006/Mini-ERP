// Re-export all types from domain-specific files
export * from "./user";
export * from "./product";
export * from "./sale";
export * from "./category";
export * from "./role";
export * from "./permission";
export * from "./dashboard";

// Generic API envelope type
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

// API Error type for consistent error handling
export interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}

// UI-specific types for RBAC components
export interface UiPermission {
  id: string | number;
  key: string;
  label: string;
  checked: boolean;
}

export interface UiSection {
  title: string;
  permissions: UiPermission[];
}

// Notification types
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
