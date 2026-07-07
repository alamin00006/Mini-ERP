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

// Update role references from lowercase to capitalized
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeactivateUserMutation,
} from "@/redux";
import type { User } from "@/types";

const UsersPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "employee" });

  const { data, isLoading, refetch } = useGetUsersQuery();
  const users = data?.data ?? [];
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "employee" });
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const payload: any = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) payload.password = formData.password;
        await updateUser({ id: editingUser._id, data: payload }).unwrap();
        toast.success("User updated successfully");
      } else {
        await createUser(formData).unwrap();
        toast.success("User created successfully");
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error(editingUser ? "Failed to update user" : "Failed to create user");
    }
  };

  const handleDeactivate = async (id: string | number) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await deactivateUser(id).unwrap();
      toast.success("User deactivated successfully");
      refetch();
    } catch (e) {
      toast.error("Failed to deactivate user");
    }
  };

  const columns: Column<User>[] = [
    { key: "name", header: "Name", render: (u) => <span className="font-medium">{u.name}</span> },
    { key: "email", header: "Email", render: (u) => u.email },
    {
      key: "role",
      header: "Role",
      render: (u) => <span className="capitalize">{u.role}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${u.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-gray-500/10 text-gray-600"}`}
        >
          {u.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
            Edit
          </Button>
          {u.isActive && (
            <Button variant="ghost" size="sm" onClick={() => handleDeactivate(u._id)}>
              Deactivate
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
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">Manage system users and their roles.</p>
        </div>
        <RoleBasedGuard roles={["Admin"]}>
          <Button onClick={openCreate}>Add User</Button>
        </RoleBasedGuard>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            rows={users}
            loading={isLoading}
            emptyMessage="No users found."
            rowKey={(u) => u._id}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Password {editingUser && "(leave blank to keep current)"}</Label>
              <Input
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating ? "Saving..." : editingUser ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
