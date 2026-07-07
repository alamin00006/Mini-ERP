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

// Update role references to match backend (capitalized)
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/redux";
import type { Role } from "@/types";
import type { ApiError } from "@/types";

const RolesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { data, isLoading, refetch } = useGetRolesQuery();

  const roles = data?.data ?? [];
  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const openCreate = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name, description: role.description || "" });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await updateRole({ id: editingRole._id, data: formData }).unwrap();
        toast.success("Role updated successfully");
      } else {
        const result = await createRole(formData).unwrap();
        toast.success(result.data.message || "Role created successfully");
      }
      setDialogOpen(false);
    } catch (error: any) {
      const apiError: ApiError = error;
      toast.error(
        apiError.data?.message || (editingRole ? "Failed to update role" : "Failed to create role"),
      );
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
      refetch();
    } catch (error: any) {
      const apiError: ApiError = error;
      toast.error(apiError.data?.message || "Failed to delete role");
    }
  };

  const columns: Column<Role>[] = [
    { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
    {
      key: "description",
      header: "Description",
      render: (r) => r.description || "-",
    },
    {
      key: "system",
      header: "System Role",
      render: (r) => <StatusBadge status={r.isSystem} activeLabel="Yes" inactiveLabel="No" />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
            Edit
          </Button>
          {!r.isSystem && (
            <Button variant="ghost" size="sm" onClick={() => handleDelete(r._id)}>
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
        title="Roles"
        description="Manage user roles and permissions."
        action={
          <PermissionGuard permissions={["role.create"]}>
            <Button onClick={openCreate}>Add Role</Button>
          </PermissionGuard>
        }
      />

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            rows={roles}
            loading={isLoading}
            emptyMessage="No roles found."
            rowKey={(r) => r._id}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Role Name</Label>
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating ? "Saving..." : editingRole ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default RolesPage;
