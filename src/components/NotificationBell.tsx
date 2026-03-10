import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, CheckCheck, Trash2, CalendarCheck, XCircle, Clock, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'confirmed' | 'cancelled' | 'completed' | 'new_booking' | 'pending';
  read: boolean;
  timestamp: Date;
  bookingId?: string;
}

const getStorageKey = (userId: string, isAdmin: boolean) =>
  isAdmin ? `luxe_notifications_admin_${userId}` : `luxe_notifications_user_${userId}`;

const loadNotifications = (userId: string | undefined, isAdmin: boolean): Notification[] => {
  if (!userId) return [];
  try {
    const stored = localStorage.getItem(getStorageKey(userId, isAdmin));
    if (!stored) return [];
    return JSON.parse(stored).map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }));
  } catch {
    return [];
  }
};

const saveNotifications = (notifications: Notification[], userId: string | undefined, isAdmin: boolean) => {
  if (!userId) return;
  localStorage.setItem(getStorageKey(userId, isAdmin), JSON.stringify(notifications.slice(0, 50)));
};

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'confirmed': return <CalendarCheck className="h-4 w-4 text-emerald-500" />;
    case 'cancelled': return <XCircle className="h-4 w-4 text-destructive" />;
    case 'completed': return <CheckCheck className="h-4 w-4 text-blue-400" />;
    case 'new_booking': return <UserPlus className="h-4 w-4 text-primary" />;
    case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

const SERVICE_LABELS: Record<string, string> = {
  classic_cut: 'Classic Cut',
  royal_shave: 'Royal Shave',
  beard_sculpt: 'Beard Sculpting',
  luxe_package: 'LUXE Package',
};

const formatService = (s: string) => SERVICE_LABELS[s] || s.replace(/_/g, ' ');

const NotificationBell = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications(user?.id, isAdmin));
  const [open, setOpen] = useState(false);

  // Reload notifications when user changes
  useEffect(() => {
    setNotifications(loadNotifications(user?.id, isAdmin));
  }, [user?.id, isAdmin]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: Notification = {
      ...notif,
      id: crypto.randomUUID(),
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev].slice(0, 50);
      saveNotifications(updated, user?.id, isAdmin);
      return updated;
    });

    toast(notif.title, {
      description: notif.message,
      icon: getIcon(notif.type),
      duration: 5000,
    });
  }, [isAdmin]);

  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      // Admin: listen for new bookings
      const channel = supabase
        .channel('admin-notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'bookings' },
          (payload) => {
            const b = payload.new as any;
            addNotification({
              type: 'new_booking',
              title: `📋 New Booking from ${b.full_name}`,
              message: `${b.full_name} requested a ${formatService(b.service)} on ${b.booking_date} at ${b.booking_time}. Awaiting your confirmation.`,
              bookingId: b.id,
            });
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'bookings' },
          (payload) => {
            const b = payload.new as any;
            const old = payload.old as any;
            if (b.status !== old.status && b.status === 'cancelled') {
              // Check if this was cancelled by admin or user
              const cancelledByAdmin = (b.notes || '').includes('[Cancelled by admin]');
              if (!cancelledByAdmin) {
                // User cancelled their own booking — notify admin
                addNotification({
                  type: 'cancelled',
                  title: `❌ ${b.full_name} Cancelled`,
                  message: `${b.full_name} cancelled their ${formatService(b.service)} appointment on ${b.booking_date} at ${b.booking_time}.`,
                  bookingId: b.id,
                });
              }
              // If admin cancelled, don't show notification to admin (they did it)
            }
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    } else {
      // User: listen for changes to their own bookings
      const channel = supabase
        .channel('user-notifications')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` },
          (payload) => {
            const b = payload.new as any;
            const old = payload.old as any;
            if (b.status === old.status) return;

            if (b.status === 'cancelled') {
              const cancelledByAdmin = (b.notes || '').includes('[Cancelled by admin]');
              if (cancelledByAdmin) {
                addNotification({
                  type: 'cancelled',
                  title: 'Booking Cancelled by Admin',
                  message: `Admin has cancelled your ${formatService(b.service)} appointment on ${b.booking_date} at ${b.booking_time}.`,
                  bookingId: b.id,
                });
              } else {
                addNotification({
                  type: 'cancelled',
                  title: 'Booking Cancelled',
                  message: `You have cancelled your ${formatService(b.service)} appointment on ${b.booking_date} at ${b.booking_time}.`,
                  bookingId: b.id,
                });
              }
              return;
            }

            const statusMessages: Record<string, { title: string; message: string; type: Notification['type'] }> = {
              confirmed: {
                type: 'confirmed',
                title: 'Booking Confirmed! ✅',
                message: `Your ${formatService(b.service)} on ${b.booking_date} at ${b.booking_time} has been confirmed. See you there!`,
              },
              completed: {
                type: 'completed',
                title: 'Session Complete 🎉',
                message: `Your ${formatService(b.service)} session has been marked as completed. Thanks for visiting!`,
              },
            };

            const info = statusMessages[b.status];
            if (info) {
              addNotification({ ...info, bookingId: b.id });
            }
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user, isAdmin, addNotification]);

  const markAllRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated, isAdmin);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    saveNotifications([], isAdmin);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(updated, isAdmin);
      return updated;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h4 className="font-serif font-semibold text-sm">Notifications</h4>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllRead}>
                <Check className="h-3 w-3 mr-1" /> Read all
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearAll}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 flex gap-3 hover:bg-muted/50 transition-colors',
                    !notif.read && 'bg-primary/5'
                  )}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{notif.title}</p>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
