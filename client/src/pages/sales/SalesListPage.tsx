import { useMemo } from "react";
import { ReceiptText, DollarSign, ShoppingCart, Calendar, User, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { useGetSalesQuery } from "@/redux/api";
import { cn } from "@/lib/utils";

interface Sale {
  _id: string;
  products: Array<{
    product: string;
    quantity: number;
    sellingPrice: number;
    subtotal: number;
  }>;
  grandTotal: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SalesListPage = () => {
  const { data, isLoading, isError, refetch, isFetching } = useGetSalesQuery({
    page: 1,
    limit: 10,
  });

  const sales = data?.data || [];
  const meta = data?.meta;

  const columns: Column<Sale>[] = [
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

  const totalRevenue = useMemo(() => {
    return sales.reduce((sum: number, sale: Sale) => sum + sale.grandTotal, 0);
  }, [sales]);

  const totalItems = useMemo(() => {
    return sales.reduce((sum: number, sale: Sale) => sum + sale.products.length, 0);
  }, [sales]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Sales</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage all sales transactions.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="shrink-0"
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                {isLoading ? (
                  <Skeleton className="mt-3 h-9 w-20" />
                ) : (
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{meta?.total || 0}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">All transactions</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                {isLoading ? (
                  <Skeleton className="mt-3 h-9 w-24" />
                ) : (
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalRevenue)}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">From all sales</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                {isLoading ? (
                  <Skeleton className="mt-3 h-9 w-20" />
                ) : (
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{totalItems}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">Total units</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <ReceiptText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-destructive">Failed to load sales</p>
              <p className="text-sm text-muted-foreground">
                Check your connection or try again in a moment.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          rows={sales}
          loading={isLoading}
          emptyMessage="No sales found."
          rowKey={(sale) => sale._id}
        />
      )}
    </div>
  );
};

export default SalesListPage;
