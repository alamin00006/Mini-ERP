import { useMemo } from "react";
import { ReceiptText, DollarSign, ShoppingCart, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { useGetSalesQuery } from "@/redux/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import type { Sale } from "@/types";
import { salesColumns } from "@/pages/sales/salesColumns";

const SalesListPage = () => {
  const { data, isLoading, isError, refetch, isFetching } = useGetSalesQuery({
    page: 1,
    limit: 10,
  });

  const sales = data?.data || [];
  const meta = data?.meta;

  const totalRevenue = useMemo(() => {
    return sales.reduce((sum: number, sale: Sale) => sum + sale.grandTotal, 0);
  }, [sales]);

  const totalItems = useMemo(() => {
    return sales.reduce((sum: number, sale: Sale) => sum + sale.products.length, 0);
  }, [sales]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sales"
        description="View and manage all sales transactions."
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          label="Total Sales"
          value={meta?.total || 0}
          icon={<ShoppingCart className="h-5 w-5" />}
          loading={isLoading}
          tone="primary"
          hint="All transactions"
        />
        <SummaryCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          loading={isLoading}
          tone="success"
          hint="From all sales"
        />
        <SummaryCard
          label="Items Sold"
          value={totalItems}
          icon={<ReceiptText className="h-5 w-5" />}
          loading={isLoading}
          tone="primary"
          hint="Total units"
        />
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
          columns={salesColumns}
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
