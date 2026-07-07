import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { ProductForm } from "@/components/products/ProductForm";
import { useCreateProductMutation } from "@/redux";
import { useAuth } from "@/hooks/useAuth";
import type { ProductFormValues } from "@/schemas/productSchema";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { hasRole, hydrated } = useAuth();
  const [createProduct] = useCreateProductMutation();

  useEffect(() => {
    if (hydrated && !hasRole(["Admin", "Manager"])) {
      toast.error("You don't have permission to add products");
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
      const result = await createProduct(formData).unwrap();
      toast.success(result.data.message || "Product created successfully");
      navigate("/products");
    } catch (error: any) {
      toast.error(error.data.message || "Failed to create product");
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
};
export default CreateProductPage;
