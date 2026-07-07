import { useMemo } from "react";
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from "@/redux";
import { useAuth } from "@/hooks/useAuth";
import type { Notification } from "@/types";
import type { ApiError } from "@/types";
import { Bell, Calendar, MessageSquare, TrendingUp, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDate } from "@/utils/formatDate";

const NotificationsPage = () => {
  const { hasRole } = useAuth();
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = useMemo(() => {
    return Array.isArray(notificationsData?.data) ? notificationsData.data : [];
  }, [notificationsData]);

  const hasAccess = useMemo(() => hasRole(["Admin"]), [hasRole]);

  if (!hasAccess) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Access Denied</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have permission to view notifications.
          </p>
        </div>
      </div>
    );
  }

  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n: Notification) => n.status === "unread").length;
    const read = notifications.filter((n: Notification) => n.status === "read").length;
    return { total, unread, read };
  }, [notifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (error: any) {
      const apiError: ApiError = error;
      toast.error(apiError.data?.message || "Failed to mark all notifications as read");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Notification History"
        description="View all sale notifications and updates in one place."
        badge={{
          icon: <Bell className="h-3.5 w-3.5" />,
          label: "Notifications",
        }}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Notifications"
          value={stats.total}
          icon={<Bell className="h-5 w-5 text-blue-600" />}
          tone="primary"
        />
        <SummaryCard
          label="Unread"
          value={stats.unread}
          icon={<MessageSquare className="h-5 w-5 text-amber-600" />}
          tone="warning"
        />
        <SummaryCard
          label="Read"
          value={stats.read}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          tone="success"
        />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">All Notifications</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete history of sale notifications
              </p>
            </div>
            {stats.unread > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">No notifications yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Notifications will appear here when sales are created
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="min-w-62.5">Message</TableHead>
                    <TableHead className="min-w-30">Type</TableHead>
                    <TableHead className="min-w-30">Status</TableHead>
                    <TableHead className="min-w-45">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {notifications.map((notification: Notification) => (
                    <TableRow key={notification._id} className="align-middle">
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{notification.message}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {notification.type}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={notification.status === "unread" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {notification.status}
                          </Badge>
                          {notification.status === "unread" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleMarkAsRead(notification._id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(notification.timestamp)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
