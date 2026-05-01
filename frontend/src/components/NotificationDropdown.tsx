import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { notificationService, Notification } from "../services/notificationService";
import { auth } from "../lib/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = notificationService.subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    if (!user) return;
    await notificationService.markAsRead(user.uid, id);
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.uid, notifications);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="size-4 text-emerald-400" />;
      case "warning": return <AlertTriangle className="size-4 text-amber-400" />;
      case "error": return <AlertCircle className="size-4 text-rose-400" />;
      default: return <Info className="size-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Bell className="size-5 text-white/70" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 size-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-[#050505]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-bottom border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="size-8 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-white/40">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 transition-colors hover:bg-white/5 relative group",
                        !notification.read && "bg-white/[0.02]"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium mb-0.5",
                            notification.read ? "text-white/60" : "text-white"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-white/40 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-white/20 mt-2">
                            {new Date(notification.createdAt?.toMillis()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 transition-all"
                            title="Mark as read"
                          >
                            <Check className="size-3 text-emerald-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
