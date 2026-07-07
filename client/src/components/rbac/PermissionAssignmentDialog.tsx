"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import type { UiSection } from "@/types";

type PermissionAssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: UiSection[];
  loading: boolean;
  saving: boolean;
  onSave: () => void;
  onSelectAll: (checked: boolean) => void;
  onSelectSection: (sectionIndex: number, checked: boolean) => void;
  onPermissionChange: (
    sectionIndex: number,
    permissionId: string | number,
    checked: boolean,
  ) => void;
};

const PermissionAssignmentDialog = ({
  open,
  onOpenChange,
  sections,
  loading,
  saving,
  onSave,
  onSelectAll,
  onSelectSection,
  onPermissionChange,
}: PermissionAssignmentDialogProps) => {
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-10 text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Loading permissions...</p>
        </div>
      );
    }

    if (sections.length === 0) {
      return (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No permissions available to assign.
        </div>
      );
    }

    return (
      <div className="space-y-6 py-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <Checkbox
              id="select-all"
              checked={selectAllState}
              onCheckedChange={(val) => onSelectAll(Boolean(val))}
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
                        onCheckedChange={(val) => onSelectSection(sectionIndex, Boolean(val))}
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
                            onPermissionChange(sectionIndex, permission.id, Boolean(val))
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
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Assign Permissions</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Select permissions to assign to this role. Use the section checkboxes to select/deselect
            entire sections.
          </p>
        </DialogHeader>

        {renderContent()}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} size="lg">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving || sections.length === 0}
            size="lg"
            className="gap-2"
          >
            {saving ? (
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
  );
};

export default PermissionAssignmentDialog;
