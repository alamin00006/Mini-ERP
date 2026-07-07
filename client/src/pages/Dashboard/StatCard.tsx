import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

const TONE_STYLES = {
  primary: {
    icon: "bg-primary/10 text-primary",
    accent: "text-primary",
  },
  success: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  danger: {
    icon: "bg-destructive/10 text-destructive",
    accent: "text-destructive",
  },
} as const;

const StatCard = ({
  label,
  value,
  icon,
  loading,
  tone = "primary",
  hint,
}: {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  loading?: boolean;
  tone?: keyof typeof TONE_STYLES;
  hint?: string;
}) => {
  const styles = TONE_STYLES[tone];
  return (
    <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="mt-3 h-9 w-20" />
            ) : (
              <p
                className={cn(
                  "mt-2 text-3xl font-semibold tracking-tight",
                  tone === "danger" && styles.accent,
                )}
              >
                {(value ?? 0).toLocaleString()}
              </p>
            )}
            {hint && (
              <p className="mt-1 text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 inline h-3 w-3" />
                {hint}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              styles.icon,
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
