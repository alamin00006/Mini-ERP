import { useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { useGetProductsQuery, useCreateSaleMutation } from "@/redux";
import type { Product } from "@/types";

interface LineItem {
  productId: string;
  quantity: number;
}

export default function CreateSalePage() {
  const [items, setItems] = useState<LineItem[]>([{ productId: "", quantity: 1 }]);
  const [createSale] = useCreateSaleMutation();

  const { data: productsData, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 500,
  });

  const products = productsData?.data ?? [];
  const productMap = useMemo(() => {
    const m = new Map<string, Product>();
    products.forEach((p) => m.set(String(p.id), p));
    return m;
  }, [products]);

  const lines = items.map((it) => {
    const p = productMap.get(it.productId);
    const price = p?.sellingPrice ?? 0;
    const subtotal = price * it.quantity;
    return { ...it, product: p, price, subtotal };
  });

  const grandTotal = lines.reduce((sum, l) => sum + l.subtotal, 0);

  const updateItem = (i: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };
  const addRow = () => setItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  const removeRow = (i: number) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const canSubmit = items.length > 0 && items.every((it) => it.productId && it.quantity >= 1);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      products: lines.map((l) => ({
        product: l.productId,
        quantity: l.quantity,
      })),
    };

    try {
      await createSale(payload).unwrap();
      toast.success("Sale recorded successfully");
      setItems([{ productId: "", quantity: 1 }]);
    } catch (e) {
      toast.error("Failed to create sale");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Create Sale</h2>
        <p className="text-sm text-muted-foreground">Add products and record a new sale.</p>
      </div>

      <form onSubmit={onSubmit}>
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Product</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((l, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Select
                          value={l.productId}
                          onValueChange={(v) => updateItem(i, { productId: v })}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product…" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name} · {p.sku}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>${l.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          value={l.quantity}
                          onChange={(e) =>
                            updateItem(i, {
                              quantity: Math.max(1, Number(e.target.value) || 1),
                            })
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="font-medium">${l.subtotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(i)}
                          disabled={items.length === 1}
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Button type="button" variant="outline" size="sm" onClick={addRow}>
                <Plus className="mr-2 h-4 w-4" /> Add product
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-xl border bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Grand Total
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  ${grandTotal.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {lines.filter((l) => l.productId).length} product(s) ·{" "}
                  {lines.reduce((s, l) => s + (l.productId ? l.quantity : 0), 0)} unit(s)
                </p>
              </div>
              <Button type="submit" size="lg" disabled={!canSubmit} className="sm:min-w-[180px]">
                Submit Sale
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
