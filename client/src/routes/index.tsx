import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import LoginPage from "@/pages/login/LoginPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import ProductsPage from "@/pages/products/ProductsPage";
import CreateProductPage from "@/pages/products/CreateProductPage";
import EditProductPage from "@/pages/products/EditProductPage";
import CreateSalePage from "@/pages/sales/CreateSalePage";
import SalesListPage from "@/pages/sales/SalesListPage";
import UsersPage from "@/pages/users/UsersPage";
import RBACPage from "@/pages/rbac/RBACPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
};

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/dashboard",
    element: (
      <AuthenticatedLayout>
        <DashboardPage />
      </AuthenticatedLayout>
    ),
  },
  {
    path: "/products",
    element: (
      <AuthenticatedLayout>
        <ProductsPage />
      </AuthenticatedLayout>
    ),
  },
  {
    path: "/products/create",
    element: (
      <AuthenticatedLayout>
        <CreateProductPage />
      </AuthenticatedLayout>
    ),
  },
  {
    path: "/products/edit/:id",
    element: (
      <AuthenticatedLayout>
        <EditProductPage />
      </AuthenticatedLayout>
    ),
  },
  {
    path: "/sales/list",
    element: (
      <AuthenticatedLayout>
        <SalesListPage />
      </AuthenticatedLayout>
    ),
  },
  {
    path: "/sales/create",
    element: (
      <AuthenticatedLayout>
        <CreateSalePage />
      </AuthenticatedLayout>
    ),
  },
  {
    path: "/users",
    element: (
      <AuthenticatedLayout>
        <UsersPage />
      </AuthenticatedLayout>
    ),
  },
  {
    path: "/roles",
    element: (
      <AuthenticatedLayout>
        <RBACPage />
      </AuthenticatedLayout>
    ),
  },

  {
    path: "/categories",
    element: (
      <AuthenticatedLayout>
        <CategoriesPage />
      </AuthenticatedLayout>
    ),
  },
  {
    path: "/notifications",
    element: (
      <AuthenticatedLayout>
        <PermissionGuard permissions={["notification.read"]}>
          <NotificationsPage />
        </PermissionGuard>
      </AuthenticatedLayout>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
]);
