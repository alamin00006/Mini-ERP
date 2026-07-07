import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { SearchBar } from "@/components/shared/SearchBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { useGetProductsQuery, useDeleteProductMutation, useGetCategoriesQuery } from "@/redux";
import type { Product } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Pagination } from "@/components/shared/Pagination";
import { getProductColumns } from "@/pages/products/productColumns";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, isError } = useGetProductsQuery({
    page,
    limit: pageSize,
    search,
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const columns = getProductColumns({
    categories,
    onEdit: (id) => navigate(`/products/edit/${id}`),
    onDelete: setToDelete,
    userPermissions: user?.permissions,
  });

  const handleDelete = async (id: string | number) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted");
      setToDelete(null);
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your inventory catalogue."
        action={
          <PermissionGuard permissions={["product.create"]}>
            <Button onClick={() => navigate("/products/create")} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </PermissionGuard>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchBar
            placeholder="Search by name, SKU, category…"
            onSearch={handleSearch}
            className="flex-1"
          />
          {search && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="shrink-0"
            >
              Clear
            </Button>
          )}
        </div>
        {search && (
          <p className="mt-2 text-xs text-muted-foreground">
            {isLoading ? "Searching products..." : "Ready to search"}
          </p>
        )}
      </Card>

      {isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load products.
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={products}
            loading={isLoading}
            emptyMessage="No products yet."
            rowKey={(p) => p._id}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete product?"
        description={
          <>
            This will permanently remove <strong>{toDelete?.name}</strong>.
          </>
        }
        confirmLabel="Delete"
        onConfirm={() => toDelete && handleDelete(toDelete._id)}
      />
    </div>
  );
}
