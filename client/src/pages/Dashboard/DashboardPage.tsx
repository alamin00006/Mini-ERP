import { useEffect } from "react";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  PackageCheck,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGetStatsQuery } from "@/redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { data, isLoading, isError, refetch, isFetching } = useGetStatsQuery();

  useEffect(() => {
    if (!hasRole(["Admin"])) {
      navigate("/products", { replace: true });
    }
  }, [hasRole, navigate]);

  const dashboardData = data?.data || {
    totalProducts: 0,
    totalSales: 0,
    totalSaleAmount: 0,
    lowStockCount: 0,
    lowStockProducts: [],
  };

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
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your inventory and sales performance."
        action={
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
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Products"
          value={dashboardData?.totalProducts || 0}
          icon={<Package className="h-5 w-5" />}
          loading={isLoading}
          tone="primary"
          hint="Items in catalogue"
        />
        <SummaryCard
          label="Total Sales"
          value={dashboardData?.totalSales || 0}
          icon={<ShoppingCart className="h-5 w-5" />}
          loading={isLoading}
          tone="success"
          hint="All-time orders"
        />
        <SummaryCard
          label="Total Sale Amount"
          value={dashboardData?.totalSaleAmount || 0}
          icon={<DollarSign className="h-5 w-5" />}
          loading={isLoading}
          tone="success"
          hint="Total revenue"
        />
        <SummaryCard
          label="Low Stock Items"
          value={dashboardData?.lowStockCount || 0}
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
          <EmptyState
            icon={<PackageCheck className="h-14 w-14 text-emerald-600" />}
            title="All stocked up"
            description="No products currently below the low-stock threshold."
          />
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
