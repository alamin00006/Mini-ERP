import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";

interface Props {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleBasedGuard = ({ roles, children, fallback = null }: Props) => {
  const { hasRole } = useAuth();
  if (!hasRole(roles)) return <>{fallback}</>;
  return <>{children}</>;
};
