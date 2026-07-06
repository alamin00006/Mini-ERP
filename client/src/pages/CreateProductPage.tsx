import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { ProductForm } from "@/features/products/ProductForm";
import { useCreateProductMutation } from "@/redux";
import { useAuth } from "@/hooks/useAuth";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { hasRole, hydrated } = useAuth();
  const [createProduct] = useCreateProductMutation();

  useEffect(() => {
    if (hydrated && !hasRole(["admin", "manager"])) {
      toast.error("You don't have permission to add products");
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
      await createProduct(fd).unwrap();
      toast.success("Product created");
      navigate("/products");
    } catch (e) {
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Add Product</h2>
        <p className="text-sm text-muted-foreground">Create a new inventory item.</p>
      </div>
      <ProductForm
        requireImage
        submitLabel="Create Product"
        onCancel={() => navigate("/products")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
