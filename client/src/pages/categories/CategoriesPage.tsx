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
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux";
import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types";

const CategoriesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });

  const { data, isLoading, refetch } = useGetCategoriesQuery();

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
    } catch (e) {
      toast.error(editingCategory ? "Failed to update category" : "Failed to create category");
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
      render: (c) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${c.isActive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
        >
          {c.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEdit(c)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
            aria-label="Edit category"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Categories</h2>
          <p className="text-sm text-muted-foreground">Manage product categories.</p>
        </div>
        <RoleBasedGuard roles={["Admin", "Manager"]}>
          <Button onClick={openCreate}>Add Category</Button>
        </RoleBasedGuard>
      </div>

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
