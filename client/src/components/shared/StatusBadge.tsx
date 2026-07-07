import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

export const StatusBadge = ({
  status,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  className,
}: StatusBadgeProps) => {
  const isActive = typeof status === "boolean" ? status : status === "active";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-600",
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-slate-400")}
      />
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
};
