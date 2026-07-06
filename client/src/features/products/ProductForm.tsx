import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { productSchema, type ProductFormValues } from "./productSchema";
import type { Product } from "@/types";

interface Props {
  initial?: Product;
  submitting?: boolean;
  requireImage: boolean;
  submitLabel: string;
  onSubmit: (values: ProductFormValues, image: File | null) => void;
  onCancel?: () => void;
}

export const ProductForm = ({
  initial,
  submitting,
  requireImage,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          sku: initial.sku,
          category: initial.category,
          purchasePrice: initial.purchasePrice,
          sellingPrice: initial.sellingPrice,
          stockQuantity: initial.stockQuantity,
        }
      : {
          name: "",
          sku: "",
          category: "",
          purchasePrice: 0,
          sellingPrice: 0,
          stockQuantity: 0,
        },
  });

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const submit = handleSubmit((values) => {
    if (requireImage && !imageFile) {
      setImageError("Product image is required");
      return;
    }
    setImageError(null);
    onSubmit(values, imageFile);
  });

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
          <Field label="Product Name" error={errors.name?.message}>
            <Input {...register("name")} placeholder="e.g. Wireless Mouse" />
          </Field>
          <Field label="SKU" error={errors.sku?.message}>
            <Input {...register("sku")} placeholder="e.g. WM-001" />
          </Field>
          <Field label="Category" error={errors.category?.message}>
            <Input {...register("category")} placeholder="e.g. Electronics" />
          </Field>
          <Field label="Stock Quantity" error={errors.stockQuantity?.message}>
            <Input type="number" min={0} {...register("stockQuantity")} />
          </Field>
          <Field label="Purchase Price" error={errors.purchasePrice?.message}>
            <Input type="number" step="0.01" min={0} {...register("purchasePrice")} />
          </Field>
          <Field label="Selling Price" error={errors.sellingPrice?.message}>
            <Input type="number" step="0.01" min={0} {...register("sellingPrice")} />
          </Field>

          <div className="md:col-span-2">
            <Label className="mb-2 block">
              Product Image {requireImage && <span className="text-destructive">*</span>}
            </Label>
            <div className="flex items-start gap-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-24 w-24 rounded-md border object-cover"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </div>
            {imageError && <p className="mt-1 text-sm text-destructive">{imageError}</p>}
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};
