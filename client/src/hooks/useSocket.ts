import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Notification } from "@/types";

const SOCKET_URL = "http://localhost:5000";

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });

      socket = socketRef.current;

      // Connection events
      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      // Listen for admin notifications
      socket.on("receiveAdminNotification", (notification) => {
        console.log("Admin notification received:", notification);
        setNotifications((prev) => [notification, ...prev]);
      });

      // Listen for manager notifications
      socket.on("receiveManagerNotification", (notification) => {
        console.log("Manager notification received:", notification);
        setNotifications((prev) => [notification, ...prev]);
      });

      // Listen for employee notifications
      socket.on("receiveEmployeeNotification", (notification) => {
        console.log("Employee notification received:", notification);
        setNotifications((prev) => [notification, ...prev]);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        socket = null;
      }
    };
  }, []);

  return {
    isConnected,
    notifications,
    socket: socketRef.current,
  };
};
