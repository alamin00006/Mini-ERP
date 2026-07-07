import { baseApi } from "./baseApi";
import type { Notification } from "@/types";

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationsResponse, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
    markAsRead: build.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllAsRead: build.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } =
  notificationsApi;
