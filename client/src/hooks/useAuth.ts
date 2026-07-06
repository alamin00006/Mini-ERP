import { useAppSelector } from "@/redux";
import type { UserRole } from "@/types";

export const useAuth = () => {
  const { user, token, hydrated } = useAppSelector((s) => s.auth);
  return {
    user,
    token,
    hydrated,
    isAuthenticated: Boolean(token && user),
    hasRole: (roles: UserRole | UserRole[]) => {
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(user.role);
    },
  };
};
