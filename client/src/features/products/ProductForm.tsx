import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productSchema, type ProductFormValues } from "./productSchema";
import type { Product, Category } from "@/types";
import { useGetCategoriesQuery } from "@/redux";

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
  const [preview, setPreview] = useState<string | null>(null);

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form;

  console.log("ProductForm initial data:", initial);
  console.log("Categories loaded:", categories);

  // Update form values and preview when initial data changes
  useEffect(() => {
    if (!initial || !initial._id) return;

    console.log("Setting initial data:", initial);
    console.log("Initial categoryId:", initial.categoryId);

    // Set basic form values
    reset({
      name: initial.name || "",
      purchasePrice: initial.purchasePrice || 0,
      sellingPrice: initial.sellingPrice || 0,
      stockQuantity: initial.stockQuantity || 0,
    });

    // Set category separately to ensure it's set after categories load
    if (initial.categoryId) {
      // Small delay to ensure categories are loaded
      const timer = setTimeout(() => {
        setValue("category", initial.categoryId, { shouldValidate: true });
      }, 100);

      return () => clearTimeout(timer);
    }

    if (initial.image) {
      setPreview(initial.image);
    }
  }, [initial, reset, setValue]);

  // Re-set category value when categories load to ensure Select displays it
  useEffect(() => {
    console.log(
      "Categories changed:",
      categories.length,
      "Initial categoryId:",
      initial?.categoryId,
    );

    if (!initial?.categoryId || categories.length === 0) return;

    // Check if the category exists in the loaded categories
    const categoryExists = categories.some((cat) => cat._id === initial.categoryId);
    console.log("Category exists in list:", categoryExists);

    if (categoryExists) {
      console.log("Setting category to:", initial.categoryId);
      setValue("category", initial.categoryId, { shouldValidate: true });
    }
  }, [categories, initial?.categoryId, setValue]);

  // Update preview when initial image changes
  useEffect(() => {
    if (initial?.image) {
    }
  }, [initial]);

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

  // Get current category value for the Select component
  const currentCategory = form.watch("category");

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
          <Field label="Product Name" error={errors.name?.message}>
            <Input {...register("name")} placeholder="e.g. Wireless Mouse" />
          </Field>
          <Field label="Category" error={errors.category?.message}>
            {categories.length > 0 ? (
              <Select
                value={currentCategory}
                onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: Category) => {
                    const catId = cat._id;
                    if (!catId) return null;
                    return (
                      <SelectItem key={catId} value={catId}>
                        {cat.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Loading categories..." />
                </SelectTrigger>
                <SelectContent />
              </Select>
            )}
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
