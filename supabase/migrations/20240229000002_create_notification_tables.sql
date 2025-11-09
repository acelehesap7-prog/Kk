-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to update only their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow service role to manage all notifications
CREATE POLICY "Service can manage all notifications" ON notifications
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create notification functions
CREATE OR REPLACE FUNCTION create_price_alert_notification(
  p_user_id UUID,
  p_symbol TEXT,
  p_price NUMERIC,
  p_condition TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    p_user_id,
    'info',
    'Fiyat Alarmı',
    format('%s fiyatı %s USDT %s', 
      p_symbol, 
      p_price, 
      CASE WHEN p_condition = 'above' THEN 'üzerine çıktı' ELSE 'altına düştü' END
    ),
    format('/trade?symbol=%s', p_symbol)
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_trade_notification(
  p_user_id UUID,
  p_symbol TEXT,
  p_side TEXT,
  p_amount NUMERIC,
  p_total NUMERIC
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    p_user_id,
    'success',
    'İşlem Gerçekleşti',
    format('%s %s %s (%s USDT)', 
      p_amount, 
      p_symbol,
      CASE WHEN p_side = 'buy' THEN 'alındı' ELSE 'satıldı' END,
      p_total
    ),
    '/wallet'
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_deposit_notification(
  p_user_id UUID,
  p_symbol TEXT,
  p_amount NUMERIC,
  p_network TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    p_user_id,
    'success',
    'Para Yatırma Onaylandı',
    format('%s %s yatırma işleminiz %s ağında onaylandı', 
      p_amount,
      p_symbol,
      p_network
    ),
    '/wallet'
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION create_withdrawal_notification(
  p_user_id UUID,
  p_symbol TEXT,
  p_amount NUMERIC,
  p_status TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    p_user_id,
    CASE WHEN p_status = 'completed' THEN 'success' ELSE 'error' END,
    'Para Çekme Durumu',
    format('%s %s çekim talebiniz %s', 
      p_amount,
      p_symbol,
      CASE WHEN p_status = 'completed' THEN 'tamamlandı' ELSE 'başarısız oldu' END
    ),
    '/wallet'
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;