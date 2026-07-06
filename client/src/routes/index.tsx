import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import CreateProductPage from "@/pages/CreateProductPage";
import EditProductPage from "@/pages/EditProductPage";
import CreateSalePage from "@/pages/CreateSalePage";

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
    path: "/sales/create",
    element: (
      <AuthenticatedLayout>
        <CreateSalePage />
      </AuthenticatedLayout>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
]);
