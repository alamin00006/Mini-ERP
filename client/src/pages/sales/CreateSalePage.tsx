import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Minus,
  PackagePlus,
  Plus,
  ReceiptText,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCreateSaleMutation, useGetProductsQuery, useGetNotificationsQuery } from "@/redux";
import type { Product } from "@/types";
import type { ApiError } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryCard } from "@/components/shared/SummaryCard";

interface LineItem {
  productId: string;
  quantity: string;
}

const getProductId = (product: Product) => String(product._id);

const toQuantityNumber = (value: string) => Number(value) || 0;

const CreateSalePage = () => {
  const [items, setItems] = useState<LineItem[]>([{ productId: "", quantity: "1" }]);

  const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();

  const { data: productsData, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 500,
  });

  const { refetch: refetchNotifications } = useGetNotificationsQuery();

  const products = productsData?.data ?? [];

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();

    products.forEach((product) => {
      map.set(getProductId(product), product);
    });

    return map;
  }, [products]);

  const lines = useMemo(() => {
    return items.map((item) => {
      const product = productMap.get(item.productId);
      const quantity = toQuantityNumber(item.quantity);
      const price = product?.sellingPrice ?? 0;
      const subtotal = price * quantity;

      return {
        ...item,
        quantityNumber: quantity,
        product,
        price,
        subtotal,
      };
    });
  }, [items, productMap]);

  const grandTotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const selectedProductCount = lines.filter((line) => line.productId).length;
  const totalQuantity = lines.reduce(
    (sum, line) => sum + (line.productId ? line.quantityNumber : 0),
    0,
  );

  const selectedProductIds = items.filter((item) => item.productId).map((item) => item.productId);

  const hasDuplicateProduct = selectedProductIds.length !== new Set(selectedProductIds).size;

  const hasStockIssue = lines.some((line) => {
    if (!line.product) return false;
    return line.quantityNumber > line.product.stockQuantity;
  });

  const hasInvalidQuantity = lines.some((line) => {
    if (!line.productId) return false;
    return line.quantityNumber < 1;
  });

  const canSubmit =
    items.length > 0 &&
    items.every((item) => item.productId) &&
    !hasInvalidQuantity &&
    !hasDuplicateProduct &&
    !hasStockIssue &&
    !isCreating;

  const updateItem = (index: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  const updateQuantityByButton = (
    index: number,
    type: "increase" | "decrease",
    maxStock?: number,
  ) => {
    const current = toQuantityNumber(items[index]?.quantity);
    const next = type === "increase" ? current + 1 : current - 1;

    const safeValue = Math.max(1, next);
    const finalValue = maxStock ? Math.min(safeValue, maxStock) : safeValue;

    updateItem(index, {
      quantity: String(finalValue),
    });
  };

  const handleQuantityInputChange = (index: number, value: string) => {
    if (value === "") {
      updateItem(index, { quantity: "" });
      return;
    }

    if (!/^\d+$/.test(value)) return;

    updateItem(index, {
      quantity: value,
    });
  };

  const handleQuantityBlur = (index: number, maxStock?: number) => {
    const current = toQuantityNumber(items[index]?.quantity);

    let finalValue = current;

    if (!finalValue || finalValue < 1) {
      finalValue = 1;
    }

    if (maxStock) {
      finalValue = Math.min(finalValue, maxStock);
    }

    updateItem(index, {
      quantity: String(finalValue),
    });
  };

  const addRow = () => {
    setItems((prev) => [...prev, { productId: "", quantity: "1" }]);
  };

  const removeRow = (index: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== index) : prev));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasDuplicateProduct) {
      toast.error("Same product cannot be selected multiple times");
      return;
    }

    if (hasInvalidQuantity) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (hasStockIssue) {
      toast.error("Quantity cannot be greater than available stock");
      return;
    }

    const payload = {
      products: lines.map((line) => ({
        product: line.productId,
        quantity: line.quantityNumber,
      })),
    };

    try {
      await createSale(payload).unwrap();
      toast.success("Sale recorded successfully");
      setItems([{ productId: "", quantity: "1" }]);
      // Refetch notifications to show the new sale notification
      refetchNotifications();
    } catch (error: any) {
      const apiError: ApiError = error;
      toast.error(apiError.data?.message || "Failed to record sale");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Create Sale"
        description="Select products, enter quantities, and record a new inventory sale."
        badge={{
          icon: <ReceiptText className="h-3.5 w-3.5" />,
          label: "Sales Management",
        }}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard label="Selected" value={selectedProductCount} tone="primary" />
        <SummaryCard label="Units" value={totalQuantity} tone="primary" />
        <SummaryCard
          label="Total"
          value={formatCurrency(grandTotal)}
          tone="success"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="border-b bg-muted/30 px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">Sale Items</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add one or more products to this sale.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRow}
                  className="w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add product
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead className="min-w-[280px]">Product</TableHead>
                      <TableHead className="min-w-[120px]">Price</TableHead>
                      <TableHead className="min-w-[100px]">Stock</TableHead>
                      <TableHead className="min-w-[150px]">Quantity</TableHead>
                      <TableHead className="min-w-[120px] text-right">Subtotal</TableHead>
                      <TableHead className="w-14" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {lines.map((line, index) => {
                      const isOverStock =
                        !!line.product && line.quantityNumber > line.product.stockQuantity;

                      return (
                        <TableRow key={index} className="align-middle">
                          <TableCell>
                            <Select
                              value={line.productId}
                              onValueChange={(value) =>
                                updateItem(index, {
                                  productId: value,
                                  quantity: "1",
                                })
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select product..." />
                              </SelectTrigger>

                              <SelectContent>
                                {products.map((product) => {
                                  const id = getProductId(product);
                                  const alreadySelected =
                                    selectedProductIds.includes(id) && id !== line.productId;

                                  return (
                                    <SelectItem key={id} value={id} disabled={alreadySelected}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{product.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          SKU: {product.sku} · Stock: {product.stockQuantity}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell className="font-medium">
                            {formatCurrency(line.price)}
                          </TableCell>

                          <TableCell>
                            <span
                              className={
                                line.product?.stockQuantity && line.product.stockQuantity < 5
                                  ? "rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive"
                                  : "rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600"
                              }
                            >
                              {line.product?.stockQuantity ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div
                              className={`flex h-10 w-[132px] items-center overflow-hidden rounded-lg border bg-background ${
                                isOverStock ? "border-destructive" : "border-input"
                              }`}
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-none border-r text-muted-foreground hover:bg-muted hover:text-foreground"
                                disabled={line.quantityNumber <= 1}
                                onClick={() =>
                                  updateQuantityByButton(
                                    index,
                                    "decrease",
                                    line.product?.stockQuantity,
                                  )
                                }
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>

                              <Input
                                type="text"
                                inputMode="numeric"
                                value={line.quantity}
                                onChange={(event) =>
                                  handleQuantityInputChange(index, event.target.value)
                                }
                                onBlur={() =>
                                  handleQuantityBlur(index, line.product?.stockQuantity)
                                }
                                className="h-10 w-12 border-0 px-1 text-center shadow-none focus-visible:ring-0"
                                aria-label="Quantity"
                              />

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-none border-l text-muted-foreground hover:bg-muted hover:text-foreground"
                                disabled={
                                  !!line.product &&
                                  line.quantityNumber >= line.product.stockQuantity
                                }
                                onClick={() =>
                                  updateQuantityByButton(
                                    index,
                                    "increase",
                                    line.product?.stockQuantity,
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>

                          <TableCell className="text-right font-semibold">
                            {formatCurrency(line.subtotal)}
                          </TableCell>

                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRow(index)}
                              disabled={items.length === 1}
                              className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Remove product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {(hasDuplicateProduct || hasInvalidQuantity || hasStockIssue) && (
                <div className="border-t bg-destructive/5 px-6 py-4">
                  {hasDuplicateProduct && (
                    <p className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      Same product cannot be selected multiple times.
                    </p>
                  )}

                  {hasInvalidQuantity && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      Quantity must be at least 1.
                    </p>
                  )}

                  {hasStockIssue && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      Quantity cannot be greater than available stock.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/30 px-5 py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PackagePlus className="h-4 w-4" />
                  Sale Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-medium">{selectedProductCount}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Quantity</span>
                  <span className="font-medium">{totalQuantity}</span>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Grand Total
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight">
                    {formatCurrency(grandTotal)}
                  </p>
                </div>

                <Button type="submit" size="lg" disabled={!canSubmit} className="w-full">
                  {isCreating ? "Submitting..." : "Submit Sale"}
                </Button>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Stock will be reduced automatically after successful sale submission.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed bg-muted/20">
              <CardContent className="p-5">
                <p className="text-sm font-medium">Sale Checklist</p>

                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Select valid products
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Enter available quantity
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Review grand total
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSalePage;
