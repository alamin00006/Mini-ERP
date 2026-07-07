import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Shield,
  Folder,
  Bell,
  ClipboardList,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permissions: ["dashboard.read"] },
  { to: "/products", label: "Products", icon: Package, permissions: ["product.read"] },
  {
    to: "/sales/create",
    label: "Create Sale",
    icon: ShoppingCart,
    permissions: ["sale.create"],
  },
  { to: "/sales/list", label: "Sales List", icon: ClipboardList, permissions: ["sale.read"] },
  { to: "/users", label: "Users", icon: Users, permissions: ["user.read"] },
  { to: "/roles", label: "Roles", icon: Shield, permissions: ["role.read"] },
  { to: "/categories", label: "Categories", icon: Folder, permissions: ["category.read"] },
  { to: "/notifications", label: "Notifications", icon: Bell, permissions: ["notification.read"] },
];
