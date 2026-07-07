import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  loading?: boolean;
  tone?: "primary" | "success" | "danger" | "warning";
  hint?: string;
  className?: string;
}

const toneStyles = {
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-amber-500/10 text-amber-600",
};

export const SummaryCard = ({
  label,
  value,
  icon,
  loading = false,
  tone = "primary",
  hint,
  className,
}: SummaryCardProps) => {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            {loading ? (
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <p className="mt-1 text-xl font-semibold">{value}</p>
            )}
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          {icon && (
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                toneStyles[tone],
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
