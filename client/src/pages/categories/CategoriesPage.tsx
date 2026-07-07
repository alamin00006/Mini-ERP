import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux";
import { Pencil } from "lucide-react";
import type { Category } from "@/types";
import { useAuth } from "@/hooks/useAuth";

const CategoriesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });

  const { user } = useAuth();

  const { data, isLoading } = useGetCategoriesQuery();

  const categories = data?.data ?? [];

  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          payload: formData,
        }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully");
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(
        error.data?.message ||
          (editingCategory ? "Failed to update category" : "Failed to create category"),
      );
    }
  };

  const columns: Column<Category>[] = [
    { key: "name", header: "Name", render: (c) => <span className="font-medium">{c.name}</span> },
    {
      key: "description",
      header: "Description",
      render: (c) => c.description || "-",
    },
    {
      key: "isActive",
      header: "Status",
      render: (c) => <StatusBadge status={c.isActive} />,
    },
  ];

  // Only show actions column if user has update or delete permission
  if (
    user?.permissions?.some((permission) =>
      ["category.update", "category.delete"].includes(permission),
    )
  ) {
    columns.push({
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <PermissionGuard permissions={["category.update"]}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEdit(c)}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
              aria-label="Edit category"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </PermissionGuard>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories."
        action={
          <PermissionGuard permissions={["category.create"]}>
            <Button onClick={openCreate}>Add Category</Button>
          </PermissionGuard>
        }
      />

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            rows={categories}
            loading={isLoading}
            emptyMessage="No categories found."
            rowKey={(c) => c._id}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating ? "Saving..." : editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
