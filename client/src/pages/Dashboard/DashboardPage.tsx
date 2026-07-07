import {
  Package,
  ShoppingCart,
  AlertTriangle,
  PackageCheck,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { useGetStatsQuery } from "@/redux";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import StatCard from "./StatCard";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useGetStatsQuery();

  const dashboardData = data?.data || {
    totalProducts: 0,
    totalSales: 0,
    lowStockCount: 0,
    lowStockProducts: [],
  };
  console.log(data);

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium">{r.name}</div>
            <div className="truncate text-xs text-muted-foreground">{r.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      render: (r) => <span className="font-mono text-xs">{r.sku}</span>,
    },
    {
      key: "stock",
      header: "Stock",
      className: "text-right",
      render: (r) => (
        <div className="flex justify-end">
          <Badge variant="destructive" className="font-mono">
            {r.stockQuantity} left
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time overview of your inventory and sales performance.
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
        <StatCard
          label="Total Products"
          value={dashboardData?.totalProducts}
          icon={<Package className="h-5 w-5" />}
          loading={isLoading}
          tone="primary"
          hint="Items in catalogue"
        />
        <StatCard
          label="Total Sales"
          value={dashboardData?.totalSales}
          icon={<ShoppingCart className="h-5 w-5" />}
          loading={isLoading}
          tone="success"
          hint="All-time orders"
        />
        <StatCard
          label="Low Stock Items"
          value={dashboardData?.lowStockCount}
          icon={<AlertTriangle className="h-5 w-5" />}
          loading={isLoading}
          tone="danger"
          hint="Below 5 units"
        />
      </div>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">Low stock products</h3>
            <p className="text-xs text-muted-foreground">
              Products with less than 5 units in stock.
            </p>
          </div>
          {dashboardData?.lowStockProducts?.length ? (
            <Badge variant="secondary" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {dashboardData.lowStockProducts.length} needs attention
            </Badge>
          ) : null}
        </div>

        {isError ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-destructive">Failed to load dashboard data</p>
                <p className="text-sm text-muted-foreground">
                  Check your connection or try again in a moment.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" /> Retry
              </Button>
            </CardContent>
          </Card>
        ) : !isLoading && (dashboardData?.lowStockProducts?.length ?? 0) === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <PackageCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">All stocked up</p>
                <p className="text-sm text-muted-foreground">
                  No products currently below the low-stock threshold.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DataTable
            columns={columns}
            rows={dashboardData?.lowStockProducts ?? []}
            loading={isLoading}
            emptyMessage="No low stock products."
            rowKey={(r) => r._id}
          />
        )}
      </section>
    </div>
  );
}
