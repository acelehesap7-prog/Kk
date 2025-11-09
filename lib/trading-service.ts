import { supabase } from './supabase'
import { MarketData, OrderBook, Trade } from './market-service'
import { KK99Service } from './kk99-service'
import { WalletService } from './wallet-service'

export interface Position {
  id: string
  userId: string
  symbol: string
  market: string
  side: 'long' | 'short'
  leverage: number
  size: number
  margin: number
  entryPrice: number
  liquidationPrice: number
  takeProfit?: number
  stopLoss?: number
  unrealizedPnl: number
  realizedPnl: number
  status: 'open' | 'closed' | 'liquidated'
}

export interface Order {
  id: string
  userId: string
  symbol: string
  market: string
  type: 'limit' | 'market'
  side: 'buy' | 'sell'
  amount: number
  price?: number
  status: 'pending' | 'filled' | 'cancelled'
  filled: number
  remaining: number
  fee: number
  feeToken: string
  timestamp: number
}

export class TradingService {
  private static instance: TradingService
  private kk99Service: KK99Service
  private walletService: WalletService

  private constructor() {
    this.kk99Service = KK99Service.getInstance()
    this.walletService = WalletService.getInstance()
  }

  static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService()
    }
    return TradingService.instance
  }

  // Spot Trading
  async createSpotOrder(order: {
    userId: string
    symbol: string
    side: 'buy' | 'sell'
    type: 'market' | 'limit'
    price?: number
    amount: number
  }): Promise<Order> {
    try {
      // Market fiyatını al
      const { data: marketData } = await supabase
        .from('market_data')
        .select('price')
        .eq('symbol', order.symbol)
        .eq('market', 'spot')
        .single();

      if (!marketData) {
        throw new Error('Market price not found');
      }

      const price = order.type === 'market' ? marketData.price : order.price!;
      const total = price * order.amount;
      const fee = total * 0.001; // %0.1 fee

      // Bakiye kontrolü
      if (order.side === 'buy') {
        const { data: usdtBalance } = await supabase
          .from('assets')
          .select('balance')
          .eq('user_id', order.userId)
          .eq('symbol', 'USDT')
          .single();

        if (!usdtBalance || usdtBalance.balance < total) {
          throw new Error('Insufficient USDT balance');
        }
      } else {
        const { data: tokenBalance } = await supabase
          .from('assets')
          .select('balance')
          .eq('user_id', order.userId)
          .eq('symbol', order.symbol)
          .single();

        if (!tokenBalance || tokenBalance.balance < order.amount) {
          throw new Error('Insufficient token balance');
        }
      }

      // İşlemi kaydet
      const { data, error } = await supabase
        .from('market_trades')
        .insert({
          user_id: order.userId,
          symbol: order.symbol,
          market: 'spot',
          side: order.side,
          type: order.type,
          price,
          amount: order.amount,
          total,
          fee,
          fee_currency: order.side === 'buy' ? 'USDT' : order.symbol,
          status: 'completed'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Bakiyeleri güncelle
      if (order.side === 'buy') {
        await Promise.all([
          // USDT bakiyesini azalt
          supabase.rpc('update_asset_balance', {
            p_user_id: order.userId,
            p_symbol: 'USDT',
            p_amount: -total
          }),
          // Token bakiyesini artır
          supabase.rpc('update_asset_balance', {
            p_user_id: order.userId,
            p_symbol: order.symbol,
            p_amount: order.amount
          })
        ]);
      } else {
        await Promise.all([
          // Token bakiyesini azalt
          supabase.rpc('update_asset_balance', {
            p_user_id: order.userId,
            p_symbol: order.symbol,
            p_amount: -order.amount
          }),
          // USDT bakiyesini artır
          supabase.rpc('update_asset_balance', {
            p_user_id: order.userId,
            p_symbol: 'USDT',
            p_amount: total
          })
        ]);
      }

      return data;
    } catch (error) {
      console.error('Error creating spot order:', error);
      throw error;
    }
  }

  // Futures Trading
  async openFuturesPosition(position: {
    userId: string;
    symbol: string;
    side: 'long' | 'short';
    leverage: number;
    margin: number;
    stopLoss?: number;
    takeProfit?: number;
  }): Promise<Position> {
    try {
      // Market fiyatını al
      const { data: marketData } = await supabase
        .from('market_data')
        .select('price')
        .eq('symbol', position.symbol)
        .eq('market', 'futures')
        .single();

      if (!marketData) {
        throw new Error('Market price not found');
      }

      const entryPrice = marketData.price;
      const size = position.margin * position.leverage;
      const liquidationPrice = position.side === 'long'
        ? entryPrice * (1 - 1 / position.leverage)
        : entryPrice * (1 + 1 / position.leverage);

      // Bakiye kontrolü
      const { data: balance } = await supabase
        .from('assets')
        .select('balance')
        .eq('user_id', position.userId)
        .eq('symbol', 'USDT')
        .single();

      if (!balance || balance.balance < position.margin) {
        throw new Error('Insufficient margin');
      }

      // Pozisyonu kaydet
      const { data, error } = await supabase
        .from('positions')
        .insert({
          user_id: position.userId,
          symbol: position.symbol,
          market: 'futures',
          side: position.side,
          leverage: position.leverage,
          size,
          margin: position.margin,
          entry_price: entryPrice,
          liquidation_price: liquidationPrice,
          take_profit: position.takeProfit,
          stop_loss: position.stopLoss,
          unrealized_pnl: 0,
          realized_pnl: 0,
          status: 'open'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Marjin bakiyesini kilitle
      await supabase.rpc('update_asset_balance', {
        p_user_id: position.userId,
        p_symbol: 'USDT',
        p_amount: -position.margin
      });

      return data;
    } catch (error) {
      console.error('Error opening futures position:', error);
      throw error;
    }
  }

  // Options Trading
  async buyOption(option: {
    userId: string;
    symbol: string;
    type: 'call' | 'put';
    strike: number;
    expiry: string;
    premium: number;
    amount: number;
  }): Promise<void> {
    try {
      // Opsiyon primi için bakiye kontrolü
      const total = option.premium * option.amount;
      const { data: balance } = await supabase
        .from('assets')
        .select('balance')
        .eq('user_id', option.userId)
        .eq('symbol', 'USDT')
        .single();

      if (!balance || balance.balance < total) {
        throw new Error('Insufficient balance for option premium');
      }

      // Opsiyon kontratını kaydet
      const { error: optionError } = await supabase
        .from('options')
        .insert({
          user_id: option.userId,
          symbol: option.symbol,
          type: option.type,
          strike: option.strike,
          expiry: option.expiry,
          premium: option.premium,
          amount: option.amount,
          status: 'active'
        });

      if (optionError) {
        throw optionError;
      }

      // Opsiyon primini düş
      await supabase.rpc('update_asset_balance', {
        p_user_id: option.userId,
        p_symbol: 'USDT',
        p_amount: -total
      });
    } catch (error) {
      console.error('Error buying option:', error);
      throw error;
    }
  }

  // Forex Trading
  async createForexOrder(order: {
    userId: string;
    symbol: string; // Örn: EUR/USD
    side: 'buy' | 'sell';
    amount: number;
    leverage?: number;
  }): Promise<void> {
    try {
      // Kaldıraç varsayılan olarak 1:100
      const leverage = order.leverage || 100;
      const requiredMargin = order.amount / leverage;

      // Bakiye kontrolü
      const { data: balance } = await supabase
        .from('assets')
        .select('balance')
        .eq('user_id', order.userId)
        .eq('symbol', 'USDT')
        .single();

      if (!balance || balance.balance < requiredMargin) {
        throw new Error('Insufficient margin for forex trade');
      }

      // Forex işlemini kaydet
      const { error } = await supabase
        .from('forex_trades')
        .insert({
          user_id: order.userId,
          symbol: order.symbol,
          side: order.side,
          amount: order.amount,
          leverage,
          margin: requiredMargin,
          status: 'open'
        });

      if (error) {
        throw error;
      }

      // Marjini kilitle
      await supabase.rpc('update_asset_balance', {
        p_user_id: order.userId,
        p_symbol: 'USDT',
        p_amount: -requiredMargin
      });
    } catch (error) {
      console.error('Error creating forex order:', error);
      throw error;
    }
  }
}

export const tradingService = new TradingService();