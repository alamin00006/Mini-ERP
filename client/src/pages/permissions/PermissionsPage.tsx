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
import { getErrorMessage } from "@/utils/getErrorMessage";

// Update role references to match backend (capitalized)
import {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "@/redux";
import type { Permission } from "@/types";
import type { ApiError } from "@/types";

export default function PermissionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    name: "",
    description: "",
    group: "",
    module: "",
  });

  const { data, isLoading, refetch } = useGetPermissionsQuery();

  const permissions = data?.data ?? [];
  const [createPermission, { isLoading: creating }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: updating }] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const openCreate = () => {
    setEditingPermission(null);
    setFormData({ key: "", name: "", description: "", group: "", module: "" });
    setDialogOpen(true);
  };

  const openEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      key: permission.key,
      name: permission.name,
      description: permission.description || "",
      group: permission.group || "",
      module: permission.module || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await updatePermission({ id: editingPermission._id, data: formData }).unwrap();
        toast.success("Permission updated successfully");
      } else {
        await createPermission(formData).unwrap();
        toast.success("Permission created successfully");
      }
      setDialogOpen(false);
    } catch (error: any) {
      const apiError: ApiError = error;
      toast.error(
        apiError.data?.message ||
          (editingPermission ? "Failed to update permission" : "Failed to create permission"),
      );
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      await deletePermission(id).unwrap();
      toast.success("Permission deleted successfully");
      refetch();
    } catch (e) {
      toast.error(getErrorMessage(e) || "Failed to delete permission");
    }
  };

  const columns: Column<Permission>[] = [
    { key: "key", header: "Key", render: (p) => <code className="text-xs">{p.key}</code> },
    { key: "name", header: "Name", render: (p) => <span className="font-medium">{p.name}</span> },
    {
      key: "group",
      header: "Group",
      render: (p) => p.group || "-",
    },
    {
      key: "module",
      header: "Module",
      render: (p) => p.module || "-",
    },
    {
      key: "system",
      header: "System",
      render: (p) => <StatusBadge status={p.isSystem} activeLabel="Yes" inactiveLabel="No" />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
            Edit
          </Button>
          {!p.isSystem && (
            <Button variant="ghost" size="sm" onClick={() => handleDelete(p._id)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permissions"
        description="Manage system permissions and access control."
        action={
          <PermissionGuard permissions={["permission.create"]}>
            <Button onClick={openCreate}>Add Permission</Button>
          </PermissionGuard>
        }
      />

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            rows={permissions}
            loading={isLoading}
            emptyMessage="No permissions found."
            rowKey={(p) => p._id}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPermission ? "Edit Permission" : "Create Permission"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Key</Label>
              <Input
                required
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="e.g. user.create"
              />
            </div>
            <div>
              <Label>Name</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Group</Label>
                <Input
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                />
              </div>
              <div>
                <Label>Module</Label>
                <Input
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating ? "Saving..." : editingPermission ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
