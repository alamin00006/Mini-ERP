"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Pencil, Trash2, List, Shield } from "lucide-react";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useSetRolePermissionsMutation,
  useGetRolePermissionsQuery,
} from "@/redux/api/rolesApi";
import { useGetPermissionsQuery } from "@/redux/api/permissionsApi";
import type { Role, Permission } from "@/types";

type UiPermission = {
  id: string | number;
  key: string;
  label: string;
  checked: boolean;
};

type UiSection = {
  title: string;
  permissions: UiPermission[];
};

const RBACPage = () => {
  // Roles state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleFormData, setRoleFormData] = useState({ name: "", description: "" });

  // Role permissions state
  const [selectedRoleId, setSelectedRoleId] = useState<string | number | null>(null);
  const [permDialogOpenForRole, setPermDialogOpenForRole] = useState(false);
  const [sections, setSections] = useState<UiSection[]>([]);

  // Queries
  const { data: rolesData, isLoading: rolesLoading, refetch: refetchRoles } = useGetRolesQuery();
  const { data: permsData } = useGetPermissionsQuery();
  const permissions = permsData?.data ?? [];
  const {
    data: rolePermsData,
    isLoading: rolePermsLoading,
    refetch: refetchRolePerms,
  } = useGetRolePermissionsQuery(selectedRoleId as any, {
    skip: !selectedRoleId,
  });

  // Mutations
  const [createRole, { isLoading: creatingRole }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updatingRole }] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [setRolePerms, { isLoading: savingPerms }] = useSetRolePermissionsMutation();

  const roles = rolesData?.data ?? [];

  // Group permissions by module/group
  const groupedPermissions = useMemo(() => {
    if (!permissions.length) return null;

    return permissions.reduce((acc: Record<string, Permission[]>, perm) => {
      const key = perm.module || perm.group || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(perm);
      return acc;
    }, {});
  }, [permissions]);

  // Role permission keys set
  const rolePermissionKeySet = useMemo(() => {
    if (!rolePermsData?.data?.permissions) return new Set<string>();
    return new Set(rolePermsData.data.permissions);
  }, [rolePermsData]);

  // Build UI sections for permission assignment
  useEffect(() => {
    if (!groupedPermissions || !selectedRoleId || rolePermsLoading) {
      setSections([]);
      return;
    }

    const nextSections: UiSection[] = Object.entries(groupedPermissions).map(
      ([moduleName, perms]) => ({
        title: moduleName,
        permissions: perms.map((p) => ({
          id: p._id,
          key: p.key,
          label: p.name,
          checked: rolePermissionKeySet.has(p.key),
        })),
      }),
    );

    setSections(nextSections);
  }, [groupedPermissions, selectedRoleId, rolePermissionKeySet, rolePermsLoading]);

  // Role handlers
  const openCreateRole = () => {
    setEditingRole(null);
    setRoleFormData({ name: "", description: "" });
    setRoleDialogOpen(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleFormData({ name: role.name, description: role.description || "" });
    setRoleDialogOpen(true);
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await updateRole({ id: editingRole._id, data: roleFormData }).unwrap();
        toast.success("Role updated successfully");
      } else {
        await createRole(roleFormData).unwrap();
        toast.success("Role created successfully");
      }
      setRoleDialogOpen(false);
      refetchRoles();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save role");
    }
  };

  const handleDeleteRole = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully");
      refetchRoles();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to delete role");
    }
  };

  // Permission assignment handlers
  const openAssignPerms = (roleId: string | number) => {
    setSelectedRoleId(null); // Reset first to force refetch
    setSections([]);
    setPermDialogOpenForRole(true);
    // Set role ID after a brief delay to trigger refetch
    setTimeout(() => setSelectedRoleId(roleId), 0);
  };

  const handleSelectAll = (checked: boolean) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        permissions: section.permissions.map((p) => ({ ...p, checked })),
      })),
    );
  };

  const handleSelectSection = (sectionIndex: number, checked: boolean) => {
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              permissions: section.permissions.map((p) => ({ ...p, checked })),
            }
          : section,
      ),
    );
  };

  const handlePermissionChange = (
    sectionIndex: number,
    permissionId: string | number,
    checked: boolean,
  ) => {
    setSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              permissions: section.permissions.map((p) =>
                p.id === permissionId ? { ...p, checked } : p,
              ),
            }
          : section,
      ),
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;

    const permissions = sections
      .flatMap((s) => s.permissions)
      .filter((p) => p.checked)
      .map((p) => p.key);

    if (permissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    try {
      await setRolePerms({ roleId: selectedRoleId, permissions }).unwrap();
      toast.success("Permissions updated successfully");
      setPermDialogOpenForRole(false);
      refetchRoles();
      refetchRolePerms();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update permissions");
    }
  };

  const totalPerms = useMemo(
    () => sections.reduce((sum, s) => sum + s.permissions.length, 0),
    [sections],
  );

  const totalChecked = useMemo(
    () => sections.reduce((sum, s) => sum + s.permissions.filter((p) => p.checked).length, 0),
    [sections],
  );

  const selectAllState: boolean | "indeterminate" =
    totalPerms === 0
      ? false
      : totalChecked === 0
        ? false
        : totalChecked === totalPerms
          ? true
          : "indeterminate";

  const isSectionState = (section: UiSection): boolean | "indeterminate" => {
    const total = section.permissions.length;
    const checked = section.permissions.filter((p) => p.checked).length;

    if (total === 0) return false;
    if (checked === 0) return false;
    if (checked === total) return true;
    return "indeterminate";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage user roles and assign permissions to control access
        </p>
      </div>

      {/* Roles Section */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Roles</CardTitle>
            <Button onClick={openCreateRole} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {rolesLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">#</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">
                      Role Name
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">
                      Description
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">
                      System Role
                    </th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role, idx) => (
                    <tr key={role._id} className="border-b border-border hover:bg-muted/20">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-foreground">{role.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {role.description || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {role.isSystem ? (
                          <Badge
                            variant="default"
                            className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                          >
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-500/10 text-gray-600">
                            No
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            title="Assign Permissions"
                            onClick={() => openAssignPerms(role._id)}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => openEditRole(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!role.isSystem && (
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8"
                              onClick={() => handleDeleteRole(role._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {roles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center">
                        <div className="text-sm text-muted-foreground">No roles found</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRoleSubmit} className="space-y-4">
            <div>
              <Label>Role Name</Label>
              <Input
                required
                value={roleFormData.name}
                onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={roleFormData.description}
                onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                placeholder="Enter description (optional)"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creatingRole || updatingRole}>
                {creatingRole || updatingRole ? "Saving..." : editingRole ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Permissions Dialog */}
      <Dialog open={permDialogOpenForRole} onOpenChange={setPermDialogOpenForRole}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Assign Permissions</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Select permissions to assign to this role. Use the section checkboxes to
              select/deselect entire sections.
            </p>
          </DialogHeader>

          {rolePermsLoading ? (
            <div className="py-10 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Loading permissions...</p>
            </div>
          ) : sections.length > 0 ? (
            <div className="space-y-6 py-4">
              {/* Select All Section */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={selectAllState}
                    onCheckedChange={(val) => handleSelectAll(Boolean(val))}
                    className="h-5 w-5"
                  />
                  <label htmlFor="select-all" className="text-sm font-semibold cursor-pointer">
                    Select All Permissions
                  </label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalChecked} of {totalPerms} selected
                </div>
              </div>

              {/* Permission Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section, sectionIndex) => {
                  const sectionChecked = section.permissions.filter((p) => p.checked).length;
                  const sectionTotal = section.permissions.length;

                  return (
                    <Card key={section.title} className="transition-all hover:shadow-md">
                      <CardHeader className="pb-3 bg-muted/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {sectionChecked}/{sectionTotal}
                            </span>
                            <Checkbox
                              id={`section-${sectionIndex}`}
                              checked={isSectionState(section)}
                              onCheckedChange={(val) =>
                                handleSelectSection(sectionIndex, Boolean(val))
                              }
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2.5">
                          {section.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-start gap-2.5 p-2 rounded hover:bg-muted/30 transition-colors"
                            >
                              <Checkbox
                                id={`perm-${permission.id}`}
                                checked={permission.checked}
                                onCheckedChange={(val) =>
                                  handlePermissionChange(sectionIndex, permission.id, Boolean(val))
                                }
                                className="mt-0.5 h-4 w-4"
                              />
                              <label
                                htmlFor={`perm-${permission.id}`}
                                className="text-sm cursor-pointer leading-tight flex-1"
                              >
                                {permission.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No permissions available to assign.
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPermDialogOpenForRole(false)}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePermissions}
              disabled={savingPerms || sections.length === 0}
              size="lg"
              className="gap-2"
            >
              {savingPerms ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Save Permissions
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RBACPage;
