import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, ChevronRight } from "lucide-react";
import { NotificationDropdown } from "@/components/shared/NotificationDropdown";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/redux";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/redux/slices/authSlice";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getUserInitials } from "@/utils/user";
import { NAV_ITEMS } from "@/layouts/navigation";

const STORAGE_KEY = "erp:sidebar:collapsed";

const usePageTitle = (pathname: string) => {
  const match = NAV_ITEMS.find((i) =>
    i.to === "/dashboard" ? pathname === i.to : i.to ? pathname.startsWith(i.to) : false,
  );
  if (pathname.startsWith("/products/create")) return "New Product";
  if (pathname.startsWith("/products/edit")) return "Edit Product";
  return match?.label ?? "Overview";
};

const useAuthPermissions = () => {
  const { user } = useAuth();
  return user?.permissions ?? [];
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userPermissions = useAuthPermissions();
  const pathname = location.pathname;
  const pageTitle = usePageTitle(pathname);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out");
    navigate("/login", { replace: true });
  };

  const isActive = (to: string) => {
    if (to === "/dashboard") return pathname === to;
    if (pathname === to) return true;
    if (to !== "/" && pathname.startsWith(to + "/")) {
      const matchingRoutes = NAV_ITEMS.filter((item) => {
        if (pathname === item.to) return true;
        if (item.to !== "/" && pathname.startsWith(item.to + "/")) return true;
        return false;
      });

      const longestMatch = matchingRoutes.reduce(
        (longest, item) => (item.to.length > longest.to.length ? item : longest),
        matchingRoutes[0],
      );
      // Return true only if this route is the longest match
      return longestMatch.to === to;
    }
    return false;
  };

  const initials = getUserInitials(user?.name ?? "U");

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-muted/40">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 hidden flex-col border-r bg-card shadow-sm transition-[width] duration-300 ease-in-out lg:flex",
            collapsed ? "w-[72px]" : "w-64",
          )}
        >
          <SidebarInner
            collapsed={collapsed}
            isActive={isActive}
            onNavigate={() => {}}
            onLogout={handleLogout}
            userPermissions={userPermissions}
          />
        </aside>

        {/* Mobile sidebar (Sheet) */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarInner
              collapsed={false}
              isActive={isActive}
              onNavigate={() => setMobileOpen(false)}
              onLogout={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              userPermissions={userPermissions}
            />
          </SheetContent>
        </Sheet>

        {/* Main area */}
        <div
          className={cn(
            "flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out",
            collapsed ? "lg:pl-[72px]" : "lg:pl-64",
          )}
        >
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/70 lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <nav
                aria-label="Breadcrumb"
                className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex"
              >
                <span>ERP</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">{pageTitle}</span>
              </nav>
              <h1 className="truncate text-base font-semibold sm:hidden">{pageTitle}</h1>
            </div>

            <PermissionGuard permissions={["notification.read"]}>
              <NotificationDropdown />
            </PermissionGuard>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border bg-background py-1 pl-1 pr-3 text-left transition-colors hover:bg-muted"
                  aria-label="Account menu"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <span className="hidden text-xs leading-tight sm:block">
                    <span className="block max-w-[140px] truncate font-medium text-foreground">
                      {user?.name ?? "—"}
                    </span>
                    <span className="block capitalize text-muted-foreground">
                      {user?.role ?? ""}
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name ?? "—"}</span>
                  <span className="text-xs font-normal capitalize text-muted-foreground">
                    {user?.role ?? ""}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

const SidebarInner = ({
  collapsed,
  isActive,
  onNavigate,
  onLogout,
  userPermissions,
}: {
  collapsed: boolean;
  isActive: (to: string) => boolean;
  onNavigate: () => void;
  onLogout: () => void;
  userPermissions: string[];
}) => {
  return (
    <>
      <div
        className={cn(
          "flex h-16 items-center border-b",
          collapsed ? "justify-center px-2" : "px-6",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            E
          </span>
          {!collapsed && (
            <span className="text-base font-semibold tracking-tight">ERP Console</span>
          )}
        </div>
      </div>

      <nav className={cn("flex-1 space-y-1 py-3", collapsed ? "px-2" : "px-3")}>
        {!collapsed && (
          <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
        )}
        {NAV_ITEMS.map(({ to, label, icon: Icon, permissions }) => {
          if (
            permissions &&
            !permissions.some((permission) => userPermissions.includes(permission))
          )
            return null;
          const active = isActive(to);
          const link = (
            <Link
              key={to}
              to={to!}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center rounded-lg text-sm font-medium transition-all",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {Icon && (
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary-foreground")} />
              )}
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );

          if (!collapsed) return link;
          return (
            <Tooltip key={to}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className={cn("border-t p-3", collapsed && "px-2")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onLogout}
                className="flex w-full items-center justify-center rounded-lg px-0 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default AppLayout;
