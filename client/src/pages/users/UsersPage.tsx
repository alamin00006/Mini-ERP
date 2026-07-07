import { useState } from "react";
import { Pencil, UserPlus } from "lucide-react";
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
import { RoleBadge } from "@/components/shared/RoleBadge";

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
} from "@/redux";
import type { User } from "@/types";
import type { ApiError } from "@/types";

const UsersPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const { data, isLoading, refetch } = useGetUsersQuery();
  const users = data?.data ?? [];

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "employee" });
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const payload: {
          name: string;
          email: string;
          role: string;
          password?: string;
        } = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };

        if (formData.password) {
          payload.password = formData.password;
        }

        await updateUser({ id: editingUser._id, data: payload }).unwrap();
        toast.success("User updated successfully");
      } else {
        await createUser(formData).unwrap();
        toast.success("User created successfully");
      }

      setDialogOpen(false);
    } catch (error: any) {
      const apiError: ApiError = error;
      toast.error(
        apiError.data?.message || (editingUser ? "Failed to update user" : "Failed to create user"),
      );
    }
  };

  const handleToggleStatus = async (id: string | number) => {
    try {
      await toggleUserStatus(id).unwrap();
      toast.success("User status updated successfully");
      refetch();
    } catch (error: any) {
      const apiError: ApiError = error;
      toast.error(apiError.data?.message || "Failed to update user status");
    }
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => <span className="font-medium">{u.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (u) => u.email,
    },
    {
      key: "role",
      header: "Role",
      render: (u) => <RoleBadge role={u.role} />,
    },
    {
      key: "status",
      header: "Status",
      render: (u) => <StatusBadge status={u.isActive} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEdit(u)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => handleToggleStatus(u._id)}
            className="h-8 px-2 hover:bg-transparent"
          >
            <span
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                u.isActive ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  u.isActive ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage system users and their roles."
        action={
          <PermissionGuard permissions={["user.create"]}>
            <Button onClick={openCreate}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </PermissionGuard>
        }
      />

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
