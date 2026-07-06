import { Link, useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProductsQuery, useDeleteProductMutation } from "@/redux";
import type { Product } from "@/types";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageSizeInput, setPageSizeInput] = useState<string>("10");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    page,
    limit: pageSize,
    search,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data ?? [];
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
    { key: "category", header: "Category", render: (p) => p.category },
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
          <RoleBasedGuard roles={["admin", "manager"]}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/products/edit/${p.id}`)}
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </RoleBasedGuard>
          <RoleBasedGuard roles={["admin"]}>
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
        <RoleBasedGuard roles={["admin", "manager"]}>
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
            rowKey={(p) => p.id}
          />
          <div className="flex flex-col gap-3 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page:</span>
              <Select
                value={
                  PAGE_SIZE_OPTIONS.includes(pageSize as (typeof PAGE_SIZE_OPTIONS)[number])
                    ? String(pageSize)
                    : "custom"
                }
                onValueChange={(v) => {
                  if (v === "custom") return;
                  setPageSize(Number(v));
                  setPageSizeInput(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[84px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" disabled>
                    Custom
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={1}
                max={500}
                value={pageSizeInput}
                onChange={(e) => setPageSizeInput(e.target.value)}
                onBlur={() => applyPageSize(pageSizeInput)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyPageSize(pageSizeInput);
                  }
                }}
                className="h-8 w-20"
                aria-label="Custom rows per page"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Page <span className="font-medium text-foreground">{page}</span> of{" "}
              <span className="font-medium text-foreground">{totalPages}</span> ·{" "}
              <span className="font-medium text-foreground">{total}</span> total
            </p>

            <div className="flex gap-2 sm:ml-auto">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex-1 sm:flex-none"
              >
                Next
              </Button>
            </div>
          </div>
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
            <AlertDialogAction onClick={() => toDelete && handleDelete(toDelete.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
