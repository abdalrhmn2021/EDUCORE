"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PUT" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
        toast.success("تم تحديث الحالة");
      } else {
        toast.error("حدث خطأ");
      }
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("تم حذف الإشعار");
      } else {
        toast.error("حدث خطأ");
      }
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Bell className="mx-autov h-12 w-12 opacity-20 mb-4" />
        <p>لا توجد اشعارت حاليا</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id}>
          <div
            className={cn(
              "flex items-start justify-between rounded-lg border transition-colors",
              notification.isRead
                ? "bg-background opacity-70"
                : "bg-card border-primary/20 shadow-sm",
            )}
          >
            <div className="flex gap-4">
              <div
                className={cn(
                  "mt-1 h-2 w-2 rounded-full shrink-0",
                  notification.isRead ? "bg-gray-300" : "bg-primary",
                )}
              />
              <p
                className={cn(
                  "text-sm",
                  notification.isRead ? "text-muted-foreground" : "font-medium",
                )}
              >
                {" "}
                {notification.message}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                {new Date(notification.createdAt).toLocaleDateString("ar-SA")}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {!notification.isRead && (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => handleMarkAsRead(notification.id)}
                title="تحديد كمقروء"
              >
                <Check className="h-4 w-4 text-primary" />
              </Button>
            )}

            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => handleDelete(notification.id)}
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
