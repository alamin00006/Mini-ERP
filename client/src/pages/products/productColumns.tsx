import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { formatCurrency } from "@/utils/formatCurrency";
import { Column } from "@/components/shared/DataTable";
import type { Product, Category } from "@/types";

type ProductColumnsProps = {
  categories: Category[];
  onEdit: (id: string) => void;
  onDelete: (product: Product) => void;
  userPermissions?: string[];
};

export const getProductColumns = ({
  onEdit,
  onDelete,
  userPermissions = [],
}: ProductColumnsProps): Column<Product>[] => {
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
      render: (p) => p.category,
    },
    { key: "purchase", header: "Purchase", render: (p) => formatCurrency(p.purchasePrice) },
    { key: "selling", header: "Selling", render: (p) => formatCurrency(p.sellingPrice) },
    {
      key: "stock",
      header: "Stock",
      render: (p) => (
        <span className={p.stockQuantity < 5 ? "font-medium text-destructive" : ""}>
          {p.stockQuantity}
        </span>
      ),
    },
  ];

  if (
    userPermissions.some((permission) => ["product.update", "product.delete"].includes(permission))
  ) {
    columns.push({
      key: "actions" as const,
      header: "Actions" as const,
      className: "w-32 text-right" as const,
      render: (p: Product) => (
        <div className="flex justify-end gap-1">
          <PermissionGuard permissions={["product.update"]}>
            <Button variant="ghost" size="icon" onClick={() => onEdit(p._id)} aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
          </PermissionGuard>
          <PermissionGuard permissions={["product.delete"]}>
            <Button variant="ghost" size="icon" onClick={() => onDelete(p)} aria-label="Delete">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </PermissionGuard>
        </div>
      ),
    });
  }

  return columns;
};
