import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  return (
    <span
      className={cn(
        "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary",
        className,
      )}
    >
      {role}
    </span>
  );
};
