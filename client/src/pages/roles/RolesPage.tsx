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

// Update role references to match backend (capitalized)
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "@/redux";
import type { Role } from "@/types";

const RolesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { data, isLoading, refetch } = useGetRolesQuery();

  const roles = data?.data ?? [];
  console.log(data);
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
        await createRole(formData).unwrap();
        toast.success("Role created successfully");
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error(editingRole ? "Failed to update role" : "Failed to create role");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
      refetch();
    } catch (e) {
      toast.error("Failed to delete role");
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
      render: (r) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${r.isSystem ? "bg-blue-500/10 text-blue-600" : "bg-gray-500/10 text-gray-600"}`}
        >
          {r.isSystem ? "Yes" : "No"}
        </span>
      ),
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Roles</h2>
          <p className="text-sm text-muted-foreground">Manage user roles and permissions.</p>
        </div>
        <RoleBasedGuard roles={["Admin"]}>
          <Button onClick={openCreate}>Add Role</Button>
        </RoleBasedGuard>
      </div>

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
