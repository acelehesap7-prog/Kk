import { supabase } from './supabase';

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  // Yeni bildirim oluştur
  async createNotification(notification: {
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    link?: string;
  }): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          read: false
        });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  // Okunmamış bildirimleri getir
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      return [];
    }
  }

  // Tüm bildirimleri getir
  async getAllNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting all notifications:', error);
      return [];
    }
  }

  // Bildirimi okundu olarak işaretle
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Tüm bildirimleri okundu olarak işaretle
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Bildirimleri sil
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  // Tüm bildirimleri sil
  async deleteAllNotifications(userId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  }

  // Fiyat alarmı bildirimi gönder
  async sendPriceAlert(alert: {
    userId: string;
    symbol: string;
    price: number;
    condition: 'above' | 'below';
  }): Promise<void> {
    const title = 'Fiyat Alarmı';
    const message = `${alert.symbol} fiyatı ${alert.price} USDT ${
      alert.condition === 'above' ? 'üzerine çıktı' : 'altına düştü'
    }`;

    await this.createNotification({
      userId: alert.userId,
      type: 'info',
      title,
      message,
      link: `/trade?symbol=${alert.symbol}`
    });
  }

  // İşlem bildirimi gönder
  async sendTradeNotification(trade: {
    userId: string;
    symbol: string;
    side: 'buy' | 'sell';
    amount: number;
    total: number;
  }): Promise<void> {
    const title = 'İşlem Gerçekleşti';
    const message = `${trade.amount} ${trade.symbol} ${
      trade.side === 'buy' ? 'alındı' : 'satıldı'
    } (${trade.total} USDT)`;

    await this.createNotification({
      userId: trade.userId,
      type: 'success',
      title,
      message,
      link: `/wallet`
    });
  }

  // Para yatırma bildirimi gönder
  async sendDepositNotification(deposit: {
    userId: string;
    symbol: string;
    amount: number;
    network: string;
  }): Promise<void> {
    const title = 'Para Yatırma Onaylandı';
    const message = `${deposit.amount} ${deposit.symbol} yatırma işleminiz ${deposit.network} ağında onaylandı`;

    await this.createNotification({
      userId: deposit.userId,
      type: 'success',
      title,
      message,
      link: `/wallet`
    });
  }

  // Para çekme bildirimi gönder
  async sendWithdrawalNotification(withdrawal: {
    userId: string;
    symbol: string;
    amount: number;
    status: string;
  }): Promise<void> {
    const title = 'Para Çekme Durumu';
    const type = withdrawal.status === 'completed' ? 'success' : 'error';
    const message = `${withdrawal.amount} ${withdrawal.symbol} çekim talebiniz ${
      withdrawal.status === 'completed' ? 'tamamlandı' : 'başarısız oldu'
    }`;

    await this.createNotification({
      userId: withdrawal.userId,
      type,
      title,
      message,
      link: `/wallet`
    });
  }
}

export const notificationService = new NotificationService();