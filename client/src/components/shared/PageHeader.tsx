import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    icon: ReactNode;
    label: string;
  };
  action?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, description, badge, action, className }: PageHeaderProps) => {
  return (
    <div
      className={`flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ${className || ""}`}
    >
      <div>
        {badge && (
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            {badge.icon}
            {badge.label}
          </div>
        )}
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
