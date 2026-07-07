import { ReceiptText, User, Calendar } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Column } from "@/components/shared/DataTable";
import type { Sale } from "@/types";

export const salesColumns: Column<Sale>[] = [
  {
    key: "saleId",
    header: "Sale ID",
    render: (sale) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ReceiptText className="h-4 w-4" />
        </div>
        <span className="font-mono text-xs">{sale._id.slice(-8).toUpperCase()}</span>
      </div>
    ),
  },
  {
    key: "items",
    header: "Items",
    render: (sale) => (
      <div>
        <p className="font-medium">{sale.products.length} product(s)</p>
        <p className="text-xs text-muted-foreground">
          {sale.products.reduce((sum, p) => sum + p.quantity, 0)} units
        </p>
      </div>
    ),
  },
  {
    key: "grandTotal",
    header: "Amount",
    className: "text-right",
    render: (sale) => (
      <div className="flex justify-end">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(sale.grandTotal)}
        </span>
      </div>
    ),
  },
  {
    key: "createdBy",
    header: "Created By",
    render: (sale) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{sale.createdBy?.name || "Unknown"}</p>
          <p className="text-xs text-muted-foreground">{sale.createdBy?.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "createdAt",
    header: "Date",
    render: (sale) => (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(sale.createdAt)}
      </div>
    ),
  },
];
