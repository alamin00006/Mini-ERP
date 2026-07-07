import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { useGetProductsQuery, useDeleteProductMutation, useGetCategoriesQuery } from "@/redux";
import type { Product, Category } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Pagination } from "@/components/shared/Pagination";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageSizeInput, setPageSizeInput] = useState<string>("10");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Debug: Log user role
  console.log("Current user role:", user?.role);

  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    page,
    limit: pageSize,
    search,
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data ?? [];

  // Helper function to get category name by _id
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat: Category) => cat._id === categoryId);
    return category?.name || categoryId;
  };
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const columns: Column<Product>[] = [
    {
      key: "image",
      header: "Image",
      render: (p) =>
        p.image ? (
          <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
          </div>
        ),
      className: "w-16",
    },
    { key: "name", header: "Name", render: (p) => <span className="font-medium">{p.name}</span> },
    { key: "sku", header: "SKU", render: (p) => p.sku },
    {
      key: "category",
      header: "Category",
      render: (p) => getCategoryName(p.category),
    },
    { key: "purchase", header: "Purchase", render: (p) => `$${p.purchasePrice.toFixed(2)}` },
    { key: "selling", header: "Selling", render: (p) => `$${p.sellingPrice.toFixed(2)}` },
    {
      key: "stock",
      header: "Stock",
      render: (p) => (
        <span className={p.stockQuantity < 5 ? "font-medium text-destructive" : ""}>
          {p.stockQuantity}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-32 text-right",
      render: (p) => (
        <div className="flex justify-end gap-1">
          <RoleBasedGuard roles={["Admin", "Manager"]}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigate(`/products/edit/${p._id}`);
              }}
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </RoleBasedGuard>
          <RoleBasedGuard roles={["Admin"]}>
            <Button variant="ghost" size="icon" onClick={() => setToDelete(p)} aria-label="Delete">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </RoleBasedGuard>
        </div>
      ),
    },
  ];

  const applyPageSize = (raw: string) => {
    const n = Math.floor(Number(raw));
    if (!Number.isFinite(n) || n < 1) return;
    setPageSize(Math.min(n, 500));
    setPage(1);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted");
      setToDelete(null);
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Products</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your inventory catalogue.</p>
        </div>
        <RoleBasedGuard roles={["Admin", "Manager"]}>
          <Button onClick={() => navigate("/products/create")} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </RoleBasedGuard>
      </div>

      <Card className="p-4">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(searchInput.trim());
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name, SKU, category…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="secondary" className="flex-1 sm:flex-none">
              Search
            </Button>
            {search && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setPage(1);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
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

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{toDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDelete && handleDelete(toDelete._id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
