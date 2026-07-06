import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, hydrated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) return;

    // Avoid redirect loops / blank screens when we're already on the login page.
    if (location.pathname === "/login") return;

    navigate("/login", { replace: true });
  }, [hydrated, isAuthenticated, navigate, location.pathname]);

  if (hydrated && !isAuthenticated) {
    // When already at /login, allow children to render.
    if (location.pathname === "/login") return <>{children}</>;
    return null;
  }

  return <>{children}</>;
};
