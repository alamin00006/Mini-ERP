"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Role } from "@/types";

type RoleFormData = {
  name: string;
  description: string;
};

type RoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole: Role | null;
  formData: RoleFormData;
  onFormDataChange: (data: RoleFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
};

const RoleDialog = ({
  open,
  onOpenChange,
  editingRole,
  formData,
  onFormDataChange,
  onSubmit,
  isLoading,
}: RoleDialogProps) => {
  // Reset form when dialog opens/closes or editing role changes
  useEffect(() => {
    if (open && editingRole) {
      onFormDataChange({ name: editingRole.name, description: editingRole.description || "" });
    } else if (open && !editingRole) {
      onFormDataChange({ name: "", description: "" });
    }
  }, [open, editingRole, onFormDataChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Role Name</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="Enter role name"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              placeholder="Enter description (optional)"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : editingRole ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;
