import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({ permissions, children, fallback = null }: Props) => {
  const { hasPermission } = useAuth();
  if (!hasPermission(permissions)) return <>{fallback}</>;
  return <>{children}</>;
};
