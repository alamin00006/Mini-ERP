import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { ProductForm } from "@/components/products/ProductForm";
import { useGetProductQuery, useUpdateProductMutation } from "@/redux";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductFormValues } from "@/schemas/productSchema";

export default function EditProductPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole, hydrated } = useAuth();
  const { data, isLoading, isError } = useGetProductQuery(id);
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (hydrated && !hasRole(["Admin", "Manager"])) {
      toast.error("You don't have permission to edit products");
      navigate("/products", { replace: true });
    }
  }, [hydrated, hasRole, navigate]);

  const handleSubmit = async (values: ProductFormValues, image: File | null) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("purchasePrice", String(values.purchasePrice));
    formData.append("sellingPrice", String(values.sellingPrice));
    formData.append("stockQuantity", String(values.stockQuantity));
    if (image) formData.append("image", image);

    try {
      const result = await updateProduct({ id, form: formData }).unwrap();
      toast.success(result.data.message || "Product updated successfully");
      navigate("/products");
    } catch (error: any) {
      toast.error(error.data.message || "Failed to update product");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Edit Product</h2>
        <p className="text-sm text-muted-foreground">Update inventory item details.</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : isError || !data ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Product not found.
        </div>
      ) : (
        <ProductForm
          initial={data.data}
          requireImage={false}
          submitLabel="Update Product"
          onCancel={() => navigate("/products")}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
