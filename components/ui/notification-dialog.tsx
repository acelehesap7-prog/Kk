import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Badge } from './badge';
import { Card } from './card';
import { notificationService } from '@/lib/notification-service';
import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export function NotificationDialog() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;
    loadNotifications();
  }, [session?.user?.id]);

  const loadNotifications = async () => {
    if (!session?.user?.id) return;
    const allNotifications = await notificationService.getAllNotifications(session.user.id);
    setNotifications(allNotifications);
    setUnreadCount(allNotifications.filter(n => !n.read).length);
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    if (!session?.user?.id) return;
    await notificationService.markAllAsRead(session.user.id);
    loadNotifications();
  };

  const handleDeleteNotification = async (id: string) => {
    await notificationService.deleteNotification(id);
    loadNotifications();
  };

  const handleDeleteAllNotifications = async () => {
    if (!session?.user?.id) return;
    await notificationService.deleteAllNotifications(session.user.id);
    loadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bildirimler</DialogTitle>
          </DialogHeader>

          <div className="flex justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Tümünü Okundu İşaretle
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAllNotifications}
              disabled={notifications.length === 0}
            >
              Tümünü Sil
            </Button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground">Bildirim yok</p>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 relative ${
                    !notification.read ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString('tr-TR')}
                        </span>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Okundu İşaretle
                            </Button>
                          )}
                          {notification.link && (
                            <Link href={notification.link}>
                              <Button variant="ghost" size="sm">
                                Görüntüle
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            Sil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}