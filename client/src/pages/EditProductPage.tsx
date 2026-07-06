import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { ProductForm } from "@/features/products/ProductForm";
import { useGetProductQuery, useUpdateProductMutation } from "@/redux";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole, hydrated } = useAuth();
  const { data, isLoading, isError, refetch } = useGetProductQuery(id);
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (hydrated && !hasRole(["admin", "manager"])) {
      toast.error("You don't have permission to edit products");
      navigate("/products", { replace: true });
    }
  }, [hydrated, hasRole, navigate]);

  const handleSubmit = async (values: any, image: File | null) => {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("sku", values.sku);
    fd.append("category", values.category);
    fd.append("purchasePrice", String(values.purchasePrice));
    fd.append("sellingPrice", String(values.sellingPrice));
    fd.append("stockQuantity", String(values.stockQuantity));
    if (image) fd.append("image", image);

    try {
      await updateProduct({ id, form: fd }).unwrap();
      toast.success("Product updated");
      navigate("/products");
    } catch (e) {
      toast.error("Failed to update product");
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
          initial={data}
          requireImage={false}
          submitLabel="Update Product"
          onCancel={() => navigate("/products")}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
