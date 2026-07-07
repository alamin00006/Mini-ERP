import { useAppSelector, useAppDispatch } from "@/redux";
import { setPermissions } from "@/redux/slices/authSlice";
import type { UserRole } from "@/types";

export const useAuth = () => {
  const { user, token, hydrated, permissions } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  return {
    user,
    token,
    hydrated,
    permissions,
    isAuthenticated: Boolean(token && user),
    hasRole: (roles: UserRole | UserRole[]) => {
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(user.role);
    },
    hasPermission: (permissionKeys: string[]) => {
      if (permissionKeys.length === 0) return true;
      return permissionKeys.some((key) => permissions.includes(key));
    },
    setPermissions: (perms: string[]) => {
      dispatch(setPermissions(perms));
    },
  };
};
